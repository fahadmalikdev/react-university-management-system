import React from "react";
import { get, post } from "../services/httpServiceWithAuth";

class StudentAssignmentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: [],
      loading: true,
    };
  }

  async componentDidMount() {
    await get("/api/v1/studentassignment/getAll")
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          this.setState({ loading: false });
        } else {
          this.setState({ assignments: data, loading: false });
        }
      })
      .catch((error) => {
        console.error("Error fetching assignments:", error);
        this.setState({ loading: false });
      });
  }

  render() {
    const { assignments, loading } = this.state;

    return (
      <>
        <div className="table-container">
          <div className="row">
            <div className="col">
              <h5 className="pb-2 mb-0">Assignments</h5>
            </div>
            <div className="col text-right"></div>
          </div>
          {loading ? (
            <p>Loading assignments...</p>
          ) : assignments.length > 0 ? (
            <div className="d-flex text-muted">
              <table className="table">
                {/* ... Your table structure */}
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>{assignment.name}</td>
                      <td>{assignment.description}</td>
                      <td>{assignment.submissionStatus}</td>
                      <td>{assignment.createdAt}</td>
                      <td>{assignment.dueDate}</td>
                      <td>{/* ... Your action button */}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Nothing to display</p>
          )}
        </div>
      </>
    );
  }
}

export default StudentAssignmentComponent;
