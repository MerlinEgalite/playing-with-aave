import { useContext, useEffect, useState } from 'react'
import { Button, Card, List, Col, Spin, Progress } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/addresses'
import creditDelegationJson from '../contracts/abis/CreditDelegation.json'

import AppContext from '../utils/app-context'

interface IProject {
	projectName: string
	projectAddress: string
	voteCount: number
	voted: boolean
}

export default function ProjectsList(): JSX.Element {
	const [loadingProjects, setLoadingProjects] = useState(true)
	const [projects, setProjects] = useState<IProject[]>([])
	const context = useContext(AppContext)

	const creditDelegationAddress = addresses.creditDelegation
	const creditDelegationAbi = creditDelegationJson.abi

	useEffect(() => {
		;(async function iife() {
			if (context.web3Provider === null) {
				return
			}

			const signer = context?.web3Provider?.getSigner()
			// const address = (await signer?.getAddress()) || ''
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const creditDelegationContract = new ethers.Contract(
				creditDelegationAddress,
				creditDelegationAbi,
				signer
			)

			// const projectAddresses = await creditDelegationContract.projectAddresses
			// eslint-disable-next-line no-constant-condition
			if (true) {
				// if (projectAddresses) {
				// const voter = (await creditDelegationContract.voters())[address]
				// const projectMapping = await creditDelegationContract.projects()
				// const projectsList = projectAddresses.map((projectAddress: string) => {
				// 	return {
				// 		...projectMapping[projectAddress],
				// 		voted: voter.voted[projectAddress],
				// 	}
				// })

				const projectsList: IProject[] = [
					{
						projectName: 'Project 1',
						projectAddress: '0x add copy / paste',
						voteCount: 50,
						voted: true,
					},
					{
						projectName: 'Project 2',
						projectAddress: '0x add copy / paste',
						voteCount: 68,
						voted: false,
					},
				]

				setProjects(projectsList)
				setLoadingProjects(false)
			} else {
				setLoadingProjects(false)
			}
		})()
	})

	return (
		<Card
			title="Projects you can vote on"
			headStyle={{ textAlign: 'center', fontWeight: 'bold' }}
		>
			{loadingProjects && (
				<div style={{ textAlign: 'center' }}>
					<Spin />
				</div>
			)}

			{!loadingProjects && projects.length > 0 && (
				<List
					dataSource={projects}
					split={false}
					renderItem={(project: IProject) => (
						<List.Item>
							<Col xs={3}>{project.projectName}</Col>
							<Col xs={6}>{project.projectAddress}</Col>
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

			{!loadingProjects && projects.length == 0 && <div>No Project</div>}
		</Card>
	)
}
