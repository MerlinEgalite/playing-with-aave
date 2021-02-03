import { useContext, useState } from 'react'
import { Form, Input, Button } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/addresses'
import CVCDJson from '../contracts/abis/ConvictionVotingCreditDelegation.json'
import ERC20Json from '../contracts/abis/IERC20.json'

import AppContext from '../utils/app-context'

interface IDepositForm {
	tokenAmount: string | number
}

export default function DepositForm(): JSX.Element {
	const [form] = Form.useForm()
	const context = useContext(AppContext)
	const [formDisabled, setFormDisabled] = useState(false)

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 14 },
	}

	const CVCDAddress = addresses.convictionVotingCreditDelegation
	const CVCDAbi = CVCDJson.abi
	const daiAddress = addresses.dai
	const ERC20Abi = ERC20Json.abi

	const onFinish = async (values: IDepositForm): Promise<boolean | void> => {
		setFormDisabled(true)

		const signer = context?.web3Provider?.getSigner()
		const address = await signer?.getAddress()
		const CVCDContract = new ethers.Contract(CVCDAddress, CVCDAbi, signer)
		const tokenContract = new ethers.Contract(daiAddress, ERC20Abi, signer)

		// Get total token amount
		const decimals = ethers.BigNumber.from(10).pow(18)
		const tokenAmount = ethers.BigNumber.from(values.tokenAmount).mul(decimals)
		const estimatedGas = (await signer?.estimateGas(
			CVCDContract.depositCollateral
		)) as ethers.BigNumber

		let allowance = 0
		// Check allowance
		try {
			allowance = await tokenContract.allowance(address, CVCDAddress)
		} catch (e) {
			console.log(e)
			setFormDisabled(false)
			return false
		}

		if (tokenAmount.gt(allowance)) {
			try {
				await tokenContract.approve(CVCDAddress, tokenAmount)
			} catch (e) {
				console.log(e)
				setFormDisabled(false)
				return false
			}
		}

		try {
			await CVCDContract.depositCollateral(daiAddress, tokenAmount, true, {
				gasLimit: estimatedGas.mul(ethers.BigNumber.from(10)),
			})
		} catch (e) {
			console.log(e)
		}

		setFormDisabled(false)
	}

	return (
		<Form {...layout} form={form} onFinish={onFinish}>
			<h2>Deposit Assets</h2>
			<Form.Item
				label="Amount"
				name="tokenAmount"
				rules={[
					{
						required: true,
						message: 'The amount of token to send is required',
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
				Deposit tokens
			</Button>
		</Form>
	)
}
