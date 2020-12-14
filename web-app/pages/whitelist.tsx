import { useContext, useState } from 'react'
import { Row, Col, Form, Input, Button } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/adresses'
import creditDelegationJson from '../contracts/abis/CreditDelegation.json'

import AppContext from '../utils/app-context'

import LayoutPage from '../components/LayoutPage'
import PageHeader from '../components/PageHeader'


export default function Whitelist(): JSX.Element {
	const [form] = Form.useForm()
	const context = useContext(AppContext)
	const [formDisabled, setFormDisabled] = useState(false)

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 14 },
	}

	const creditDelegationAddress = addresses.creditDelegation
	const creditDelegationAbi = creditDelegationJson.abi

	const onFinish = async (values: any): Promise<void> => {
		setFormDisabled(true)

		const signer = context?.web3Provider?.getSigner()
		const creditDelegationContract = new ethers.Contract(creditDelegationAddress, creditDelegationAbi, signer)

		// Get total token amount
		const decimals = ethers.BigNumber.from(10).pow(18)
		const tokenAmount = ethers.BigNumber.from(values.tokenAmount).mul(decimals)
		const estimatedGas = (await signer?.estimateGas(creditDelegationContract.approveBorrower)) as ethers.BigNumber

		console.log(values.borrowerAddress)
		console.log(tokenAmount)
		console.log(values.tokenAddress)

		try {
			await creditDelegationContract.approveBorrower(
				values.borrowerAddress,
				tokenAmount,
				values.tokenAddress,
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
				title="Whitelist someone"
				subtitle="Here you can whitelist someone to borrow money"
			/>
			<Row gutter={[0, 24]}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<Form {...layout} form={form} style={{ paddingTop: '24px' }} onFinish={onFinish} requiredMark={false}>
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
						<Row gutter={[24, 24]}>
							<Button type="primary" htmlType="submit" disabled={formDisabled}>
								Whitelist borrower
							</Button>
						</Row>
					</Form>
				</Col>
			</Row>
		</LayoutPage>
	)
}
