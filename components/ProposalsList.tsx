// import { useContext, useState } from 'react'
import { Button, Card, List, Col, Progress } from 'antd'

// import { ethers } from 'ethers'
// import addresses from '../contracts/addresses'
// import CVCDJson from '../contracts/abis/ConvictionVotingCreditDelegation.json'

// import useProposals from '../hooks/useProposals'
// import AppContext from '../utils/app-context'

export default function ProposalsList(): JSX.Element {
	// const [loadingProjects, setLoadingProjects] = useState(true)
	// const context = useContext(AppContext)

	// const proposals = useProposals()

	const proposals = [
		{
			projectId: 1,
			beneficiary: '0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73',
			voteCount: 50,
			voted: true,
		},
		{
			projectId: 2,
			beneficiary: '0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73',
			voteCount: 68,
			voted: false,
		},
	]

	return (
		<Card
			title="Projects you can vote on"
			headStyle={{ textAlign: 'center', fontWeight: 'bold' }}
		>
			{/* {loadingProjects && (
				<div style={{ textAlign: 'center' }}>
					<Spin />
				</div>
			)} */}

			{proposals.length > 0 && (
				<List
					dataSource={proposals}
					split={false}
					renderItem={(project: any) => (
						<List.Item
							style={{ cursor: 'pointer' }}
							onClick={() => console.log(project.projectId)}
						>
							<Col xs={1}>{project.projectId}</Col>
							<Col xs={11}>{project.beneficiary}</Col>
							<Col xs={6}>
								<Progress percent={project.voteCount} />
								{project.voteCount} / {67} To pass
							</Col>
							<Col xs={3}>
								{project.voted ? (
									<Button size="middle" type="default" disabled>
										<span role="img" aria-label="earth">
											✅
										</span>{' '}
										Voted
									</Button>
								) : (
									<Button size="middle" type="default">
										Vote
									</Button>
								)}
							</Col>
						</List.Item>
					)}
				/>
			)}

			{/* {!loadingProjects && proposals.length == 0 && <div>No Proposals</div>} */}
		</Card>
	)
}
