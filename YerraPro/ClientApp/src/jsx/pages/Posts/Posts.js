import { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import EditPost from '../../pages/EditPost/EditPost';
import SinglePost from '../../pages/SinglePost/SinglePost';
import { Row, Col, Card, Table,  } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import swal from "sweetalert";

import {
    createPostAction,
    getPostsAction,
    deletePostAction,
} from '../../../store/actions/PostActions';

class Posts extends Component {
    onCreatePost() {
        this.props.createPostAction();
    }
    componentDidMount() {
        if (this.props.posts && !this.props.posts.length) {
            this.props.getPostsAction();
        }
    }
    onDeletePost(postId) {
		swal({
			title: "Are you sure?",
			text:
				"Are you sure you want to delete post?",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			}).then((response) => {
			if (response) {
				this.props.deletePostAction(postId, this.props.history);							 ;
				swal("Poof! Your imaginary file has been deleted!", {
					icon: "success",
			    });
			}else {
				swal("Your imaginary file is safe!");
			}
		})
		
    }
    render() {
        const posts = [
			
		];
		
			for (let post of this.props.posts) {
				posts.push(		
					
					<tr key={post.id}>
						<td>{post.number}</td>
						<td>{post.title}</td>
						<td>
							{post.lastname}
						</td>
						<td>{post.description}</td>
						<td className="color-primary">{post.location}</td>
						<td>
							<div className="d-flex">
								<Link href="#" className="btn btn-primary shadow btn-sm sharp mr-2"
									to={{ pathname: `/posts/edit/${post.id}` }}
								>
									<i className="fa fa-pencil scale4"></i>
								</Link>
								<Link href="#" className="btn btn-danger shadow btn-sm sharp"
									onClick={() => this.onDeletePost(post.id)}
								>
									<i className="fa fa-trash scale4"></i>
								</Link>
							</div>
						</td>
						<td>
							<Link
								to={{ pathname: `/posts/${post.id}` }}
								className='btn light btn-info'
							>
								View Details
							</Link>
						</td>
					</tr>,
				);
			}
					
        return (
			<>
				<PageTitle activeMenu="post" pageContent="post" motherMenu="Components" />
				<div className='mt-4'>
					<div className='flex'>
						<div className='flex-1'>
							<div className='flex flex-wrap'>
								<Row>
									<Col lg={12}>
										<Card>
											<Card.Header className="d-flex align-items-center justify-content-between">
												<h4 className="card-title">Post</h4>
												<div>
													<Link to='/createpost' className='btn btn-primary '>
														Create Post
													</Link>
												</div>
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
															<th>Action</th>
														</tr>
													</thead>
													<tbody>
														{posts}
													</tbody>
												</Table>
											</Card.Body>	
										</Card>		
									</Col>
								</Row>
							</div>
						</div>
						<div className='flex-1'>
							{this.props.posts.length && (
								<div>
									<Switch>
										<Route
											path='/posts/:id'
											exact
											component={SinglePost}
										/>
										<Route
											path='/posts/edit/:id'
											component={EditPost}
										/>
									</Switch>
								</div>
							)}
						</div>
					</div>
				</div>
			</>	
        );
    }
}

const mapStateToProps = (state) => {
	return {
       posts: state.posts.posts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(
        { createPostAction, getPostsAction, deletePostAction },
        dispatch,
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
