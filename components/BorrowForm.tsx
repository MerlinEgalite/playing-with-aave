import { useContext, useState } from 'react'
import { Form, Input, Button } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/addresses'
import CVCDJson from '../contracts/abis/ConvictionVotingCreditDelegation.json'

import AppContext from '../utils/app-context'

interface IBorrowForm {
	tokenAmount: string | number
}

export default function BorrowForm(): JSX.Element {
	const [form] = Form.useForm()
	const context = useContext(AppContext)
	const [formDisabled, setFormDisabled] = useState(false)
	// TODO: change that
	const proposalId = 1

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 14 },
	}

	const CVCDAddress = addresses.convictionVotingCreditDelegation
	const CVCDAbi = CVCDJson.abi

	const onFinish = async (values: IBorrowForm): Promise<void> => {
		setFormDisabled(true)

		const signer = context?.web3Provider?.getSigner()
		const CVCDContract = new ethers.Contract(CVCDAddress, CVCDAbi, signer)

		// Get total token amount
		const decimals = ethers.BigNumber.from(10).pow(18)
		const tokenAmount = ethers.BigNumber.from(values.tokenAmount).mul(decimals)
		const estimatedGas = (await signer?.estimateGas(
			CVCDContract.borrowCredit
		)) as ethers.BigNumber

		try {
			await CVCDContract.borrowCredit(proposalId, tokenAmount, {
				gasLimit: estimatedGas.mul(ethers.BigNumber.from(10)),
			})
		} catch (e) {
			console.log(e)
		}

		setFormDisabled(false)
	}

	return (
		<Form {...layout} form={form} onFinish={onFinish} requiredMark={false}>
			<Form.Item
				label="Amount"
				name="tokenAmount"
				rules={[
					{
						required: true,
						message: 'The amount of token to borrow is required',
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
				Borrow tokens
			</Button>
		</Form>
	)
}
