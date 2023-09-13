import React from "react";
import InstructorAssignmentComponent from "../components/InstructorAssignmentComponent";
import StudentAssignmentComponent from "../components/StudentAssignmentComponent";
import adminLayout from "../hoc/adminLayout";

class AssignmentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  studentComponent() {
    return (
      <>
        <StudentAssignmentComponent />
      </>
    );
  }

  instructorComponent() {
    return (
      <>
        <InstructorAssignmentComponent />
      </>
    );
  }

  render() {

    const userDetail = localStorage.getItem('userDetail');
    const userDetailParsed = JSON.parse(userDetail);

    let component;
    if (userDetailParsed.role === 'student') component = this.studentComponent();
    else component = this.instructorComponent();

    return (
      <>
        <div>{component}</div>
      </>
    );
  }
}

export default adminLayout(AssignmentPage);
