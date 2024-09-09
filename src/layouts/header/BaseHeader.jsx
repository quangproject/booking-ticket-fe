import { Link } from "react-router-dom";

const BaseHeader = () => {
  return (
    <header
      className="logo row justify-content-between align-items-center"
      style={{ backgroundColor: "#6a9cfd" }}
    >
      <div className="col-6 text-start">
        <Link to="/">
          <img
            src="/img/logo-gdsc.png"
            className="img-fluid"
            alt="GDSC club logo"
          />
        </Link>
      </div>
      <div className="col-6 text-end">
        <img src="/img/Logo-GW.png" className="img-fluid" alt="art club logo" />
        <Link to="/manage">
          <img
            src="/img/logo-art-club.png"
            className="img-fluid"
            alt="greenwich logo"
          />
        </Link>
      </div>
    </header>
  );
};

export default BaseHeader;
