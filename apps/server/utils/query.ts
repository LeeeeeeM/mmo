import mysql from "mysql";

export const queryPromise = (
  connection: mysql.Connection,
  query: string,
  values: any[]
): Promise<any[]> =>
  new Promise((resolve, reject) => {
    connection.query(query, values, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
