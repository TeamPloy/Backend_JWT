const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
//const cron = require('node-cron');
//const { swaggerUi, specs } = require('./modules/swagger');
const app = express();

app.use(
	cors({
		origin: '*', 
		credentials: true,
		withCredentials: true,
		optionsSuccessStatus: 200,
	})
);

app.set("port", process.env.PORT);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결됨.");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const loginRouter = require("./routes/loginRouter");
app.use("/login", loginRouter);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

app.get('/', (req, res) => {
	res.send('BSSMBALL API (PORT : 9898)');
});

// cron.schedule('0 0 * * *', () => {
//   Vote.destroy({ truncate: true }) // Vote 테이블 초기화
//     .then(() => {
//       console.log('Vote 테이블 초기화 완료');
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });