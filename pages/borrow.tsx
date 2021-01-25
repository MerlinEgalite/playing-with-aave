import { useContext, useState, useEffect } from 'react'
import { Row, Col, Form, Input, Button } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/addresses'
import simpleCreditDelegationJson from '../contracts/abis/SimpleCreditDelegation.json'

import AppContext from '../utils/app-context'

import LayoutPage from '../components/LayoutPage'
import PageHeader from '../components/PageHeader'

interface IBorrowForm {
	tokenAddress: string
	tokenAmount: string | number
}

export default function Borrow(): JSX.Element {
	const [form] = Form.useForm()
	const context = useContext(AppContext)
	const [formDisabled, setFormDisabled] = useState(false)
	const [allowance, setAllowance] = useState('0')

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 14 },
	}

	const creditDelegationAddress = addresses.simpleCreditDelegation
	const creditDelegationAbi = simpleCreditDelegationJson.abi
	const signer = context?.web3Provider?.getSigner()
	const creditDelegationContract = new ethers.Contract(
		creditDelegationAddress,
		creditDelegationAbi,
		signer
	)

	useEffect(() => {
		;(async function iife() {
			if (context.web3Provider === null) {
				return
			}

			try {
				const address = await context?.web3Provider?.getSigner().getAddress()
				const result = await creditDelegationContract.checkAllowance(
					address,
					'0xff795577d9ac8bd7d90ee22b6c1703490b6512fd'
				)
				setAllowance(result.toString())
			} catch (e) {
				console.log(e)
			}
		})()
	})

	const onFinish = async (values: IBorrowForm): Promise<void> => {
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
			creditDelegationContract.borrowCredit
		)) as ethers.BigNumber

		try {
			await creditDelegationContract.borrowCredit(
				tokenAmount,
				values.tokenAddress,
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
			<PageHeader linkToImage="/earth.png" title="Borrow" subtitle="" />
			<Row gutter={[0, 24]}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<p style={{ textAlign: 'center' }}>
						Your are allowed to borrow: {allowance} Kovan Dai
					</p>
				</Col>
			</Row>
			<Row gutter={[0, 24]}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<Form
						{...layout}
						form={form}
						onFinish={onFinish}
						requiredMark={false}
					>
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
						<Button
							style={{ float: 'right' }}
							type="primary"
							htmlType="submit"
							disabled={formDisabled}
						>
							Borrow tokens
						</Button>
					</Form>
				</Col>
			</Row>
		</LayoutPage>
	)
}
