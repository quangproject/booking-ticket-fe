import { useRoutes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ManagePage from "./pages/manage/ManagePage";

function App() {
  const router = useRoutes([
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/manage",
      element: <ManagePage />
    }
  ]);

  return router;
}

export default App;
