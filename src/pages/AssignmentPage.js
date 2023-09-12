import React from "react";
import adminLayout from "../hoc/adminLayout";

class AssignmentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <>
        <p>Assignment page content here..</p>
      </>
    );
  }
}

export default adminLayout(AssignmentPage);
