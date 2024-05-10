import Database from "@tauri-apps/plugin-sql";

// const result = await db.execute(`
//   DROP TABLE IF EXISTS punchcards;
//   DROP TABLE IF EXISTS apps;
//   DROP TABLE IF EXISTS tasks;
//   DROP TABLE IF EXISTS projects;
//   CREATE TABLE apps (
//     appId INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT,
//     command TEXT);
//   CREATE TABLE projects (
//     projectId INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT,
//   );
//   CREATE TABLE tasks (
//     taskId INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT,
//     projectId INTEGER,
//     FOREIGN KEY(projectId) REFERENCES projects(projectId)
//   )
//   CREATE TABLE punchcards (
//     punchcardId INTEGER PRIMARY KEY AUTOINCREMENT,
//     taskId INTEGER,
//     appId INTEGER NOT NULL,
//     start INTEGER NOT NULL,
//     end INTEGER,
//     FOREIGN KEY(appId) REFERENCES apps(appId)
//     FOREIGN KEY(taskId) REFERENCES tasks(taskId)
//   )
// `);

const db = Database.load("sqlite:test.db");

export const punchard = (app) =>
  db.then(async (db) => {
    let res, appId;
    app.app_name = app.app_name.trim();
    // appId
    res = await db.select(`select * from apps where name = "${app.app_name}";`);
    if (res.length == 0) {
      res = await db.execute(
        `INSERT into apps (name, command) VALUES ("${app.app_name}", "${app.process_path}")`
      );
      appId = res.lastInsertId;
    } else {
      appId = res[0].appId;
    }

    // task
    let task = "NULL";
    if (app.title != "") {
      res = await db.select(
        `SELECT * FROM tasks WHERE name = "${app.title}"  LIMIT 1;`
      );
      if (res.length == 0) {
        res = await db.execute(
          `INSERT into tasks (name) VALUES ("${app.title}")`
        );
        task = res.lastInsertId;
      } else {
        task = res[0].taskId;
      }
    }

    // punchcard
    const ctime = Math.round(Date.now() / 1000);
    res = await db.select(
      `SELECT * FROM punchcards ORDER BY punchcardId DESC LIMIT 1;`
    );
    if (res[0]?.appId == appId)
      await db.execute(
        `UPDATE punchcards
            SET end = ${ctime}
            WHERE punchcardId = ${res[0].punchcardId}
        `
      );
    else
      await db.execute(`INSERT into
        punchcards (appId, taskId, start, end)
        VALUES (${appId}, ${task}, ${ctime}, ${ctime + 10})`);
  });

export const getPunchcards = (app) =>
  db.then(async (db) => {
    return await db.select(
      `SELECT * FROM punchcards ORDER BY punchcardId DESC;`
    );
  });

export const timeSpent = (app) =>
  db.then(async (db) => {
    return await db.select(
      `SELECT 
        SUM(p.end - p.start) AS time, a.name 
        FROM punchcards p, apps a
        WHERE a.appId=p.appId
        GROUP BY a.appId
        ORDER BY time DESC;`
    );
  });
