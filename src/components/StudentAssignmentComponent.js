import React from "react";
import { get, put } from "../services/httpServiceWithAuth";

class StudentAssignmentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: [],
      loading: true,
      isModalOpen: false,
      submissionText: "",
      selectedAssignmentId: null
    };
  }

  async fetchAssignments() {
    try {
      const data = await get("/api/v1/studentassignment/getAll");
      if (data.length === 0) {
        this.setState({ assignments: [], loading: false });
      } else {
        this.setState({
          assignments: data.data[0].student_assignemnt,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      this.setState({ loading: false });
    }
  }

  async componentDidMount() {
    this.fetchAssignments();
  }

  formatDateTime(dateTimeString) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = new Date(dateTimeString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }

  openModal = (assignmentId) => {
    this.setState({ isModalOpen: true, selectedAssignmentId: assignmentId });
  }

  closeModal = () => {
    this.setState({ isModalOpen: false });
    this.fetchAssignments();
  }

  handleInputChange = (e) => {
    this.setState({ submissionText: e.target.value });
  };

  handleSubmit = async () => {
    const { submissionText, selectedAssignmentId } = this.state;
    try {
      await put(`/api/v1/assignment/submit?assignemnt_id=${selectedAssignmentId}`, { submission_date: Date.now() });
      this.closeModal();
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  isSubmitButtonDisabled(dueDate, submissionStatus) {
    const currentDate = new Date();
    const parsedDueDate = new Date(dueDate);
    return parsedDueDate < currentDate || submissionStatus === 'submitted';
  }

  render() {
    const { assignments, loading, isModalOpen, submissionText,ope } = this.state;

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
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Submission Status</th>
                    <th>Submission Date</th>
                    <th>Created At</th>
                    <th>Due Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.assignments.id}>
                      <td>{assignment.assignments.name}</td>
                      <td>{assignment.assignments.description}</td>
                      <td>{assignment.submission_status}</td>
                      <td>{(assignment.submission_date) ? this.formatDateTime(assignment.submission_date) : '-'}</td>
                      <td>{this.formatDateTime(assignment.assignments.created_at)}</td>
                      <td>{this.formatDateTime(assignment.assignments.due_date)}</td>
                      <td>
                        {!this.isSubmitButtonDisabled(assignment.assignments.due_date, assignment.submission_status) && (
                        <div className="dropdown table-action-dropdown">
                          <button
                            className="btn btn-secondary btn-sm dropdown-toggle"
                            type="button"
                            id="dropdownMenuButtonSM"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButtonSM"
                          >
                            <li>
                              <button 
                                className="dropdown-item" 
                                href="#" 
                                onClick={()=>{this.openModal(assignment.assignments.id)}}
                              >
                                <i className="fa fa-upload" aria-hidden="true"></i>
                                &nbsp;Submit
                              </button>
                            </li>
                          </ul>
                        </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Nothing to display</p>
          )}
        </div>


        <div
          className={`modal ${isModalOpen ? "show" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{ display: isModalOpen ? "block" : "none" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              {/* Modal header */}
              <div className="modal-header">
                <h5 className="modal-title">Submit Assignment</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={this.closeModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              {/* Modal body */}
              <div className="modal-body">
                {/* Add your modal content here */}
                {/* Example: */}
                <div className="form-group">
                  <label htmlFor="submissionText">Submission Text</label>
                  <input
                    type="text"
                    className="form-control"
                    id="submissionText"
                    value={submissionText}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={this.closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }
}

export default StudentAssignmentComponent;
