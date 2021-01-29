import { useContext, useState } from 'react'
import { Form, Input, Button } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/addresses'
import simpleCreditDelegationJson from '../contracts/abis/SimpleCreditDelegation.json'

import AppContext from '../utils/app-context'

export default function WhitelistForm(): JSX.Element {
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

	const onFinish = async (values: any): Promise<void> => {
		setFormDisabled(true)

		const signer = context?.web3Provider?.getSigner()
		const creditDelegationContract = new ethers.Contract(
			creditDelegationAddress,
			creditDelegationAbi,
			signer
		)

		// Get total token amount
		const decimals = ethers.BigNumber.from(10).pow(18)
		const tokenAmount = ethers.BigNumber.from(values.tokenAmount).mul(decimals)
		const estimatedGas = (await signer?.estimateGas(
			creditDelegationContract.approveBorrower
		)) as ethers.BigNumber

		try {
			await creditDelegationContract.approveBorrower(
				values.borrowerAddress,
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
		<Form
			{...layout}
			form={form}
			style={{ paddingTop: '24px' }}
			onFinish={onFinish}
			requiredMark={false}
		>
			<h2>Whitelist an Ethereum address</h2>
			<Form.Item
				label="Borrower address"
				name="borrowerAddress"
				rules={[
					{
						required: true,
						message: 'The address of the borrower is required',
					},
				]}
			>
				<Input disabled={formDisabled} />
			</Form.Item>
			<Form.Item
				label="Amount"
				name="tokenAmount"
				rules={[
					{
						required: true,
						message: 'The amount of tokens the borrower can borrow is required',
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
				Whitelist borrower
			</Button>
		</Form>
	)
}
