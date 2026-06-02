import app from "./app";
import { config } from "./core/config";

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${config.NODE_ENV} mode`);
});
