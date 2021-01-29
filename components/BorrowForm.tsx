import { useContext, useState } from 'react'
import { Form, Input, Button } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/addresses'
import simpleCreditDelegationJson from '../contracts/abis/SimpleCreditDelegation.json'

import AppContext from '../utils/app-context'

interface IBorrowForm {
	tokenAmount: string | number
}

// TODO: add a limit on the form he can borrow
export default function Borrow(): JSX.Element {
	const [form] = Form.useForm()
	const context = useContext(AppContext)
	const [formDisabled, setFormDisabled] = useState(false)

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 14 },
	}

	const creditDelegationAddress = addresses.simpleCreditDelegation
	const creditDelegationAbi = simpleCreditDelegationJson.abi
	const daiAddress = addresses.dai

	const onFinish = async (values: IBorrowForm): Promise<void> => {
		setFormDisabled(true)

		const signer = context?.web3Provider?.getSigner()
		const simpleCreditDelegationContract = new ethers.Contract(
			creditDelegationAddress,
			creditDelegationAbi,
			signer
		)

		// Get total token amount
		const decimals = ethers.BigNumber.from(10).pow(18)
		const tokenAmount = ethers.BigNumber.from(values.tokenAmount).mul(decimals)
		const estimatedGas = (await signer?.estimateGas(
			simpleCreditDelegationContract.borrowCredit
		)) as ethers.BigNumber

		try {
			await simpleCreditDelegationContract.borrowCredit(
				tokenAmount,
				daiAddress,
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
