import { useContext, useEffect, useState } from 'react'
import { Row, Col, Form, Input, Button } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/adresses'
import creditDelegationJson from '../contracts/abis/CreditDelegation.json'

import AppContext from '../utils/app-context'

import LayoutPage from '../components/LayoutPage'
import PageHeader from '../components/PageHeader'


export default function App(): JSX.Element {
	const [form] = Form.useForm()
	const context = useContext(AppContext)
	const [formDisabled, setFormDisabled] = useState(false)

	const layout = {
		labelCol: { span: 5 },
		wrapperCol: { span: 14 },
	}

	const creditDelgeationAddress = addresses.creditDelegation
	const creditDelgeationAbi = creditDelegationJson.abi

	const onFinish = async (values: any): Promise<void> => {
		setFormDisabled(true)

		console.log(values)

		const signer = context?.web3Provider?.getSigner()
		const address = await signer?.getAddress()
		const userAddress = address
		const crediDelegationContract = new ethers.Contract(creditDelgeationAddress, creditDelgeationAbi, signer)

		// Get total token amount
		const decimals = ethers.BigNumber.from(10).pow(18)
		const tokenAmount = ethers.BigNumber.from(values.tokenAmount).mul(decimals)

		try {
			await crediDelegationContract.depositCollateral(values.tokenAddress, tokenAmount, false)
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<LayoutPage>
			<PageHeader
				linkToImage="/earth.png"
				title="Deposit"
				subtitle=""
			/>
			<Row gutter={[0, 24]}>
				<Col style={{ textAlign: 'center' }} md={{ span: 14, offset: 5 }} xs={{ span: 20, offset: 2 }}>
					<Form {...layout} form={form} style={{ paddingTop: '24px' }} onFinish={onFinish} requiredMark={false}>
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
									message: 'The number of people to reward is required',
								},
							]}
						>
							<Input disabled={formDisabled} type="number" min={0} />
						</Form.Item>
						<Row gutter={[24, 24]}>
							<Button type="primary" htmlType="submit" disabled={formDisabled}>
								Deposit tokens
							</Button>
						</Row>
					</Form>
				</Col>
			</Row>
		</LayoutPage>
	)
}
