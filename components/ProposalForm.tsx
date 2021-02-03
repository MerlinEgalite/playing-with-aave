import { useContext, useState } from 'react'
import { Form, Input, Button } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/addresses'
import CVCDJson from '../contracts/abis/ConvictionVotingCreditDelegation.json'

import AppContext from '../utils/app-context'

interface IProposalForm {
	title: string
	link: string
	requestedAmount: string | number
	beneficiary: string
}

export default function ProposalForm(): JSX.Element {
	const [form] = Form.useForm()
	const context = useContext(AppContext)
	const [formDisabled, setFormDisabled] = useState(false)

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 14 },
	}

	const CVCDAddress = addresses.convictionVotingCreditDelegation
	const CVCDAbi = CVCDJson.abi

	const onFinish = async (values: IProposalForm): Promise<void> => {
		setFormDisabled(true)

		const signer = context?.web3Provider?.getSigner()
		const CVCDContract = new ethers.Contract(CVCDAddress, CVCDAbi, signer)

		// Get total token amount
		const decimals = ethers.BigNumber.from(10).pow(18)
		const requestedAmount = ethers.BigNumber.from(values.requestedAmount).mul(
			decimals
		)
		const estimatedGas = (await signer?.estimateGas(
			CVCDContract.addProposal
		)) as ethers.BigNumber

		try {
			await CVCDContract.addProposal(
				values.title,
				values.link,
				requestedAmount,
				values.beneficiary,
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
		<Form {...layout} form={form} onFinish={onFinish} requiredMark={false}>
			<h2>Create a Proposal</h2>
			<Form.Item
				label="Title of the proposal"
				name="title"
				rules={[
					{
						required: true,
						message: 'The title of the project is required',
					},
				]}
			>
				<Input disabled={formDisabled} />
			</Form.Item>
			<Form.Item label="Link to useful resources" name="link">
				<Input disabled={formDisabled} />
			</Form.Item>
			<Form.Item
				label="Requested Amount"
				name="requestedAmount"
				rules={[
					{
						required: true,
						message: 'The amount of token to borrow is required',
					},
				]}
			>
				<Input disabled={formDisabled} type="number" min={0} />
			</Form.Item>
			<Form.Item
				label="Bénéficiaire"
				name="beneficiary"
				rules={[
					{
						required: true,
						message: 'The beneficiary of the loan is required',
					},
				]}
			>
				<Input disabled={formDisabled} />
			</Form.Item>
			<Button
				style={{ float: 'right' }}
				type="primary"
				htmlType="submit"
				disabled={formDisabled}
			>
				Create Proposal
			</Button>
		</Form>
	)
}
