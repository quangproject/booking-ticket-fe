import PropTypes from "prop-types";
import BaseHeader from "./header/BaseHeader";

const BaseLayout = ({ children }) => {
  return (
    <div className="container-fluid">
      <BaseHeader />
      {children}
    </div>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;
