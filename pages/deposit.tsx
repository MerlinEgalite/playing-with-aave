import { useContext, useState } from 'react'
import { Row, Col, Form, Input, Button } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/addresses'
import creditDelegationJson from '../contracts/abis/CreditDelegation.json'
import ERC20Json from '../contracts/abis/IERC20.json'

import AppContext from '../utils/app-context'

import LayoutPage from '../components/LayoutPage'
import PageHeader from '../components/PageHeader'

interface IDepositForm {
	tokenAddress: string
	tokenAmount: string | number
}

export default function Deposit(): JSX.Element {
	const [form] = Form.useForm()
	const context = useContext(AppContext)
	const [formDisabled, setFormDisabled] = useState(false)

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 14 },
	}

	const creditDelegationAddress = addresses.creditDelegation
	const creditDelegationAbi = creditDelegationJson.abi

	const daiAddress = addresses.dai
	const ERC20Abi = ERC20Json.abi

	const onFinish = async (values: IDepositForm): Promise<boolean | void> => {
		setFormDisabled(true)

		const signer = context?.web3Provider?.getSigner()
		const address = await signer?.getAddress()
		const creditDelegationContract = new ethers.Contract(
			creditDelegationAddress,
			creditDelegationAbi,
			signer
		)
		const tokenContract = new ethers.Contract(daiAddress, ERC20Abi, signer)

		// Get total token amount
		const decimals = ethers.BigNumber.from(10).pow(18)
		const tokenAmount = ethers.BigNumber.from(values.tokenAmount).mul(decimals)
		const estimatedGas = (await signer?.estimateGas(
			creditDelegationContract.depositCollateral
		)) as ethers.BigNumber

		let allowance = 0
		// Check allowance
		try {
			allowance = await tokenContract.allowance(
				address,
				creditDelegationAddress
			)
		} catch (e) {
			console.log(e)
			setFormDisabled(false)
			return false
		}

		if (tokenAmount.gt(allowance)) {
			try {
				await tokenContract.approve(creditDelegationAddress, tokenAmount)
			} catch (e) {
				console.log(e)
				setFormDisabled(false)
				return false
			}
		}

		try {
			await creditDelegationContract.depositCollateral(
				values.tokenAddress,
				tokenAmount,
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
			<PageHeader linkToImage="/earth.png" title="Deposit" subtitle="" />
			<Row gutter={[0, 24]}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<Form
						{...layout}
						form={form}
						onFinish={onFinish}
						requiredMark={false}
					>
						<Form.Item
							label="Asset address"
							name="tokenAddress"
							rules={[
								{
									required: true,
									message: 'Token address is required',
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
				</Col>
			</Row>
		</LayoutPage>
	)
}
