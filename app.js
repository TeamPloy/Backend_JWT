const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
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

const testRouter = require("./routes/testRouter"); 
app.use("/test", testRouter);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

app.get('/', (req, res) => {
	res.send('BSSMBALL API (PORT : 9898)');
});
