import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { getPost } from '../../../store/selectors/PostSelectors';
import {
  Row,
  Col,
  Card,
  Table,
} from "react-bootstrap";

function SinglePost(props) {
    return (
		<>
			<Row>
				<Col lg={12}>
					<Card>
						<Card.Header>
							<Card.Title>Id: {props.post.id}</Card.Title>
							<Link className="btn btn-dark light btn-md" to="./" >back to post</Link>
						</Card.Header>
						<Card.Body>
							<Table responsive>
								<thead>
									<tr>
										<th>#</th>
										<th>Name</th>
										<th>Last Name</th>
										<th>Designation</th>
										<th>Location</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th>{props.post.number} </th>
										<td>{props.post.title}</td>
										<td>
										  {props.post.lastname}
										</td>
										<td>{props.post.description}</td>
										<td className="color-primary">{props.post.location}</td>
									</tr>
								</tbody>
							 </Table>
						</Card.Body>
					</Card>
				</Col>
			</Row>	
		</>	
    );
}

const makeStateToProps = () => {
    const post = getPost();
    return (state, props) => {
        return {
            post: post(state, props.match.params.id),
        };
    };
};

export default connect(makeStateToProps)(SinglePost);
