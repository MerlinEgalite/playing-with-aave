import { useContext, useState } from 'react'
import { Row, Col, Form, Input, Button } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/adresses'
import creditDelegationJson from '../contracts/abis/CreditDelegation.json'

import AppContext from '../utils/app-context'

import LayoutPage from '../components/LayoutPage'
import PageHeader from '../components/PageHeader'


export default function Borrow(): JSX.Element {
	const [form] = Form.useForm()
	const context = useContext(AppContext)
	const [formDisabled, setFormDisabled] = useState(false)

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 14 },
	}

	const creditDelegationAddress = addresses.creditDelegation
	const creditDelegationAbi = creditDelegationJson.abi

	const getAllowance = async (): Promise<void> => {
		const signer = context?.web3Provider?.getSigner()
		const creditDelegationContract = new ethers.Contract(creditDelegationAddress, creditDelegationAbi, signer)
		const response = await creditDelegationContract.checkAllowance(
			'0x122a4f8848fb5df788340fd07fc7276cc038dc01',
			'0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
			'0xff795577d9ac8bd7d90ee22b6c1703490b6512fd'
		)

		console.log(response.toString())
	}

	const onFinish = async (values: any): Promise<void> => {
		setFormDisabled(true)

		const signer = context?.web3Provider?.getSigner()
		const creditDelegationContract = new ethers.Contract(creditDelegationAddress, creditDelegationAbi, signer)

		// Get total token amount
		const decimals = ethers.BigNumber.from(10).pow(18)
		const tokenAmount = ethers.BigNumber.from(values.tokenAmount).mul(decimals)
		const estimatedGas = (await signer?.estimateGas(creditDelegationContract.borrowCredit)) as ethers.BigNumber

		console.log(estimatedGas)
		console.log(values)

		try {
			await creditDelegationContract.borrowCredit(
				tokenAmount,
				values.tokenAddress,
				values.delegatorAddress,
				{ gasLimit: estimatedGas.mul(ethers.BigNumber.from(10)) }
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
				title="Borrow"
				subtitle=""
			/>
			<Row gutter={[0, 24]}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<Button type="primary" onClick={() => getAllowance()}>
						Test
					</Button>
				</Col>
			</Row>
			<Row gutter={[0, 24]}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<Form {...layout} form={form} onFinish={onFinish} requiredMark={false}>
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
							label="Delegator address"
							name="delegatorAddress"
							rules={[
								{
									required: true,
									message: 'The address of the delegator is required',
								},
							]}
						>
							<Input disabled={formDisabled} />
						</Form.Item>
						<Form.Item>
							<Button style={{ float: 'right' }} type="primary" htmlType="submit" disabled={formDisabled}>
								Borrow tokens
							</Button>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</LayoutPage>
	)
}
