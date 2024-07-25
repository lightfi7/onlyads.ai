const db = require("../models");
const hash = require("../utils/hash");
const exec = require("child_process").exec;
const Setting = db.setting;
const Status = db.status;
const fs = require("fs");
// Database connection details
const dbOptions = {
  user: "root",
  pass: "mari2Ana23sem",
  host: "localhost",
  port: 27017,
  database: "mydatabase",
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 2,
  autoBackupPath: "./backup/backup.archive", // e.g., /var/database-backup/
};

exports.setPaypalOption = async (req, res) => {
  const { apiKey } = req.body;

  Setting.findOne()
    .then((data) => {
      if (data) {
        data.paypal = apiKey;
        data
          .save()
          .then(() => {
            res.send({
              message: "ok",
            });
          })
          .catch((err) => {
            res.status(400).send({
              code: 500,
              message: "server error",
            });
          });
      } else {
        Setting.create({ paypal: apiKey })
          .then(() => {
            res.send({
              message: "ok",
            });
          })
          .catch((err) => {
            res.status(400).send({
              code: 500,
              message: "server error",
            });
          });
      }
    })
    .catch((err) => {
      res.status(400).send({
        code: 500,
        message: "server error",
      });
    });
};

exports.getPaypalOption = (req, res) => {
  Setting.findOne()
    .then((data) => {
      res.send({
        apiKey: data?.paypal,
      });
    })
    .catch((err) => {
      res.status(400).send({
        code: 500,
        message: "server error",
      });
    });
};

exports.setThemeColor = (req, res) => {
  const { color } = req.body;

  Setting.findOne({})
    .then((data) => {
      if (data) {
        data.color = color;
        data.save().then(() => {
          res.send("Success");
        });
      } else {
        Setting.create({ color: color }).then(() => {
          res.send("Success");
        });
      }
    })
    .catch((err) => {
      res.status(500).send("Internal server error");
    });
};

exports.getThemeColor = (req, res) => {
  Setting.findOne({})
    .then((data) => {
      res.send({
        color: data?.color,
      });
    })
    .catch((err) => {
      res.status(500).send("Internal server error");
    });
};

exports.getStatus = (req, res) => {
  Status.findOne({})
    .then((data) => {
      res.send({
        status: data,
      });
    })
    .catch((err) => {
      res.status(500).send("Internal server error");
    });
};

exports.backup = (req, res) => {
  let cmd = `mongodump --db=${dbOptions.database} --username=${dbOptions.user} --password=${dbOptions.pass} --authenticationDatabase=admin --archive=./backup/backup.archive`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup process exited with error: ${error}`);
      res.status(400).send("Backup process exited with error");
    } else {
      const filePath = "./backup/backup.archive";
      const fileName = "backup.archive";

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="backup.archive"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      console.log("Successfully backed up the database");
    }
  });
};

exports.getIntercomOptions = (req, res) => {
  const { uid } = req.query;
  Setting.findOne({})
    .then((data) => {
      if (uid)
        res.send({
          app_id: data?.intercom?.app_id,
          hash: hash(data?.intercom?.intercom_secret_key, uid.toString()),
        });
      else res.send(data?.intercom);
    })
    .catch((err) => {
      res.status(500).send("Internal server error");
    });
};

exports.setIntercomOptions = (req, res) => {
  Setting.findOneAndUpdate({}, { intercom: req.body })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.status(500).send("Internal server error"));
};
