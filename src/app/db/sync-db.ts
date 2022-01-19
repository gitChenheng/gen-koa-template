import DB from "./index";

try {
  (async () => {
    await DB.getDBCtx().sync({
      alter: true
    });
    console.log("db sync finished");
    process.exit(0);
  })();
}catch (e){
  console.error(`db sync error: ${JSON.stringify(e)}`);
}
