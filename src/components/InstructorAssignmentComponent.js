import React from "react";
import { get, post, put } from "../services/httpServiceWithAuth";

class InstructorAssignmentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: [],
      loading: true,
      isModalOpen: false,
      isModalOpenCreate: false,
      isModalOpenSubmission: false,
      selectedAssignmentId: null,
      assignmentName: "",
      assignmentDescription: "",
      assignmentDueDate: "",
      assignmentSubmissionArray: [],
      currentDate: '',
    };
  }

  async fetchAssignments() {
    try {
      const data = await get("/api/v1/assignment/getAll");
      if (data.length === 0) {
        this.setState({ assignments: [], loading: false });
      } else {
        this.setState({
          assignments: data.data[0].assignemnt,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      this.setState({ loading: false });
    }
  }

  async fetchAssignmentById(assignmentId) {
    try {
      const data = await get(`/api/v1/assignment/getassignmentbyid?assignment_id=${assignmentId}`);
      if (data) {
        this.setState({ assignmentName: data.data.assignments.name, assignmentDescription: data.data.assignments.description});
      } else {
        this.setState({ assignmentName: "", assignmentDescription: "" });
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      this.setState({ loading: false });
    }
  }
  
  async fetchAssignmentSubmissions(assignmentId) {
    try {
      const data = await get(`/api/v1/assignment/submissiondetails?assignment_id=${assignmentId}`);
      console.log('data', data);
      if (data) {
        this.setState({ assignmentSubmissionArray: data.data });
      } else {
        this.setState({ assignmentSubmissionArray: [] });
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

  formatDateToYYYYMMDD(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  isEditDisabled(dueDate, currentDate) {
    const differenceInDays = Math.floor(
      (new Date(dueDate) - currentDate) / (1000 * 60 * 60 * 24)
    );
    return differenceInDays < 4;
  }

  openModalViewSubmission = (assignmentId, assignmentName, assignmentDescription) => {
    this.fetchAssignmentSubmissions(assignmentId);
    this.setState({ isModalOpenSubmission: true, selectedAssignmentId: assignmentId, assignmentName: assignmentName, assignmentDescription: assignmentDescription });
  }

  openModalEdit = (assignmentId) => {
    this.fetchAssignmentById(assignmentId);
    this.setState({ isModalOpen: true, selectedAssignmentId: assignmentId });
  }

  openModalCreate = () => {
    const currentTimestamp = Date.now();
    const formattedDate = this.formatDateToYYYYMMDD(currentTimestamp);
    this.setState({ isModalOpenCreate: true, currentDate: formattedDate })
  }

  closeModal = () => {
    this.setState({ 
      isModalOpen: false, 
      isModalOpenSubmission: false,
      isModalOpenCreate: false,
      assignmentName: "", 
      assignmentDescription: "",
      assignmentDueDate: "",
      selectedAssignmentId: null,
      assignmentSubmissionArray: [],
      currentDate: ''
    });
    this.fetchAssignments();
  }

  handleInputChangeName = (e) => {
    this.setState({ assignmentName: e.target.value });
  };

  handleInputChangeDescription = (e) => {
    this.setState({ assignmentDescription: e.target.value });
  };

  handleInputChangeDueDate = (e) => {
    this.setState({ assignmentDueDate: e.target.value });
  };

  handleSubmitEdit = async () => {
    const { selectedAssignmentId, assignmentName, assignmentDescription } = this.state;
    try {
      await put(`/api/v1/assignment/update?id=${selectedAssignmentId}`, { name: assignmentName, description: assignmentDescription });
      this.closeModal();
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  handleSubmitCreate = async () => {
    const { assignmentName, assignmentDescription, assignmentDueDate } = this.state;
    try {
      await post(`/api/v1/assignment/create`, { name: assignmentName, description: assignmentDescription, due_date: assignmentDueDate });
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
    const { assignments, loading, isModalOpen, isModalOpenCreate, isModalOpenSubmission, assignmentName, assignmentDescription, assignmentDueDate, assignmentSubmissionArray, currentDate } = this.state;

    return (
      <>
        <div className="table-container">
          <div className="row">
            <div className="col">
              <h5 className="pb-2 mb-0">Assignments</h5>
            </div>
            <div className="col text-right">
              <button 
                className="btn btn-primary low-height-btn"
                onClick={()=>{this.openModalCreate()}}
              >
                <i className="fa fa-plus"></i> Create Assignment
              </button>
            </div>
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
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Due Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>{assignment.name}</td>
                      <td>{assignment.description}</td>
                      <td>{this.formatDateTime(assignment.created_at)}</td>
                      <td>{this.formatDateTime(assignment.updated_at)}</td>
                      <td>{this.formatDateTime(assignment.due_date)}</td>
                      <td>
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
                            {!this.isEditDisabled(assignment.due_date, Date.now()) && (
                            <li>
                              <button 
                                className="dropdown-item" 
                                href="#" 
                                onClick={()=>{this.openModalEdit(assignment.id)}}
                              >
                                <i className="fa fa-edit" aria-hidden="true"></i>
                                &nbsp;Edit
                              </button>
                            </li>
                            )}
                            <li>
                              <button 
                                className="dropdown-item" 
                                href="#" 
                                onClick={()=>{this.openModalViewSubmission(assignment.id, assignment.name, assignment.description)}}
                              >
                                <i className="fa fa-eye" aria-hidden="true"></i>
                                &nbsp;View Submissions
                              </button>
                            </li>
                          </ul>
                        </div>
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
          className={`modal ${isModalOpenCreate ? "show" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{ display: isModalOpenCreate ? "block" : "none" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              {/* Modal header */}
              <div className="modal-header">
                <h5 className="modal-title">Create Assignment</h5>
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
                  <label htmlFor="assignmentName">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="assignmentName"
                    value={assignmentName}
                    onChange={this.handleInputChangeName}
                  />
                </div>
                <br></br>
                <div className="form-group">
                  <label htmlFor="assignmentDescription">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="assignmentDescription"
                    value={assignmentDescription}
                    onChange={this.handleInputChangeDescription}
                  />
                </div>
                <br></br>
                <div className="form-group">
                  <label htmlFor="assignmentDueDate">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="assignmentDueDate"
                    value={assignmentDueDate}
                    min={currentDate}
                    onChange={this.handleInputChangeDueDate}
                  />
                </div>
                <br></br>
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
                  onClick={this.handleSubmitCreate}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
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
                <h5 className="modal-title">Edit Assignment</h5>
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
                  <label htmlFor="assignmentName">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="assignmentName"
                    value={assignmentName}
                    onChange={this.handleInputChangeName}
                  />
                </div>
                <br></br>
                <div className="form-group">
                  <label htmlFor="assignmentDescription">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="assignmentDescription"
                    value={assignmentDescription}
                    onChange={this.handleInputChangeDescription}
                  />
                </div>
                <br></br>
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
                  onClick={this.handleSubmitEdit}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>


        <div
          className={`modal ${isModalOpenSubmission ? "show" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{ display: isModalOpenSubmission ? "block" : "none" }}
        >
          <div className="modal-dialog custom" role="document">
            <div className="modal-content">
              {/* Modal header */}
              <div className="modal-header">
                <h5 className="modal-title">Assignment Submission Detail</h5>
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
                <div>
                  <p><strong>Name:</strong> {assignmentName}</p>
                  <p><strong>Description:</strong> {assignmentDescription}</p>
                </div>
                <div className="table-container">
                  <div className="row">
                    {/* <div className="col">
                      <h5 className="pb-2 mb-0">Assignments</h5>
                    </div> */}
                    <div className="col text-right"></div>
                  </div>
                  {loading ? (
                    <p>Loading assignments...</p>
                  ) : assignmentSubmissionArray.length > 0 ? (
                    <div className="d-flex text-muted">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Submission Status</th>
                            <th>Submission Date</th>
                            <th>Created At</th>
                            <th>Due Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignmentSubmissionArray.map((assignment) => (
                            <tr key={assignment.assignments.id}>
                              <td>{assignment.student_assignments.name}</td>
                              <td>{assignment.submission_status}</td>
                              <td>{(assignment.submission_date) ? this.formatDateTime(assignment.submission_date) : "-"}</td>
                              <td>{this.formatDateTime(assignment.assignments.created_at)}</td>
                              <td>{this.formatDateTime(assignment.assignments.due_date)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>Nothing to display</p>
                  )}
                </div>
              </div>

              {/* Modal footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                  onClick={this.closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }
}

export default InstructorAssignmentComponent;
