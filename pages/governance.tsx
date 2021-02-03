import { useContext, useState } from 'react'
import { Row, Col, Form, Input, Button } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/addresses'
import governanceCreditDelegationJson from '../contracts/abis/GovernanceCreditDelegation.json'

import AppContext from '../utils/app-context'

import LayoutPage from '../components/LayoutPage'
import PageHeader from '../components/PageHeader'
import ProjectsList from '../components/ProposalsList'

interface IProjectProposalForm {
	projectName: string
	amountNeeded: string | number
}

export default function Governance(): JSX.Element {
	const [form] = Form.useForm()
	const context = useContext(AppContext)
	const [formDisabled, setFormDisabled] = useState(false)

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 14 },
	}

	const governanceCreditDelegationAddress = addresses.governanceCreditDelegation
	const governanceCreditDelegationAbi = governanceCreditDelegationJson.abi

	const onProjectProposalSubmit = async (
		values: IProjectProposalForm
	): Promise<boolean | void> => {
		setFormDisabled(true)

		const signer = context?.web3Provider?.getSigner()
		const address = await signer?.getAddress()
		const governanceCreditDelegationContract = new ethers.Contract(
			governanceCreditDelegationAddress,
			governanceCreditDelegationAbi,
			signer
		)

		// Get total token amount
		const decimals = ethers.BigNumber.from(10).pow(18)
		const amountNeeded = ethers.BigNumber.from(values.amountNeeded).mul(
			decimals
		)
		const estimatedGas = (await signer?.estimateGas(
			governanceCreditDelegationContract.addProjectProposal
		)) as ethers.BigNumber

		try {
			await governanceCreditDelegationContract.addProjectProposal(
				values.projectName,
				address,
				amountNeeded,
				true,
				{
					gasLimit: estimatedGas.mul(ethers.BigNumber.from(10)),
				}
			)
		} catch (e) {
			console.log(e)
		}

		setFormDisabled(false)
	}

	return (
		<LayoutPage>
			<PageHeader
				linkToImage="/earth.png"
				title="Governance"
				subtitle="Propose or vote for a project"
			/>
			<Row gutter={[0, 24]} style={{ marginBottom: '64px' }}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<Form
						{...layout}
						form={form}
						onFinish={onProjectProposalSubmit}
						requiredMark={false}
					>
						<Form.Item
							label="Project Name"
							name="projectName"
							rules={[
								{
									required: true,
									message: 'Project name is required',
								},
							]}
						>
							<Input disabled={formDisabled} />
						</Form.Item>
						<Form.Item
							label="Amount"
							name="amountNeeded"
							rules={[
								{
									required: true,
									message: 'The amount of DAI needed is required',
								},
							]}
						>
							<Input disabled={formDisabled} type="number" min={0} />
						</Form.Item>
						<Button
							style={{ float: 'right' }}
							type="primary"
							htmlType="submit"
							disabled={formDisabled}
						>
							Submit Project Proposal
						</Button>
					</Form>
				</Col>
			</Row>
			<Row gutter={[0, 24]} style={{ marginBottom: '64px' }}>
				<Col md={{ span: 14, offset: 5 }} xs={{ span: 20, offset: 2 }}>
					<ProjectsList />
				</Col>
			</Row>
		</LayoutPage>
	)
}
