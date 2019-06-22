import React from 'react';

import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import ListGroup from 'react-bootstrap/ListGroup';

import Octicon, { KebabHorizontal } from '@primer/octicons-react';

import ErrorMessage from '../ErrorMessage';

import { formatVoteTimes } from '../../helpers';

const VotesList = ({ error, votes }) => {
	return (
		<React.Fragment>
			<ErrorMessage error={error} />

			{votes && (
				<ListGroup>
					{votes.map((vote) => (
						<VotesListItem key={vote._id} {...vote} />
					))}
				</ListGroup>
			)}
		</React.Fragment>
	);
};

class CustomToggle extends React.Component {
	handleClick = (e) => {
		e.preventDefault();

		this.props.onClick(e);
	}

	render() {
		return (
			<Button variant='outline-secondary' onClick={this.handleClick}>
				{this.props.children}
			</Button>
		);
	}
}

const VotesListItem = ({ title, startDate, endDate }) => {
	const disabled = new Date(endDate) < Date.now();

	return (
		<ListGroup.Item action={!disabled} as='div'>
			<div className='d-flex w-100 justify-content-between align-items-center'>
				<div className={disabled && 'text-muted'}>
					<b>{title}</b><br />
					<small className='text-muted'>
						{formatVoteTimes(startDate, endDate)}
					</small>
				</div>

				<Dropdown>
					<Dropdown.Toggle as={CustomToggle} id='vote-options-toggle'>
						<Octicon icon={KebabHorizontal} />
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item>Bookmark</Dropdown.Item>
						<Dropdown.Item>Share</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Header>Danger Zone</Dropdown.Header>
						<Dropdown.Item>Edit</Dropdown.Item>
						<Dropdown.Item>Delete</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</ListGroup.Item>
	);
};

export default VotesList;
