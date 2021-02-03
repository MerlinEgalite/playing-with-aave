import { useContext, useState, useEffect } from 'react'
import { Row, Col } from 'antd'

import { ethers } from 'ethers'
import addresses from '../contracts/addresses'
import CVCDJson from '../contracts/abis/SimpleCreditDelegation.json'

import AppContext from '../utils/app-context'

import LayoutPage from '../components/LayoutPage'
import PageHeader from '../components/PageHeader'
import BorrowForm from '../components/BorrowForm'

export default function Borrow(): JSX.Element {
	const context = useContext(AppContext)
	const [allowance, setAllowance] = useState('0')

	const signer = context?.web3Provider?.getSigner()
	const CVCDAddress = addresses.convictionVotingCreditDelegation
	const CVCDAbi = CVCDJson.abi
	const CVCDContract = new ethers.Contract(CVCDAddress, CVCDAbi, signer)

	useEffect(() => {
		;(async function iife() {
			if (context.web3Provider === null) {
				return
			}

			try {
				const address = await context?.web3Provider?.getSigner().getAddress()
				const result = await CVCDContract.checkAllowance(
					CVCDAddress,
					address,
					addresses.dai
				)
				setAllowance(result.toString())
			} catch (e) {
				console.log(e)
			}
		})()
	})

	return (
		<LayoutPage>
			<PageHeader linkToImage="/earth.png" title="Borrow" subtitle="" />
			<Row gutter={[0, 24]}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<p style={{ textAlign: 'center' }}>
						Your are allowed to borrow: {allowance} Kovan DAI
					</p>
				</Col>
			</Row>
			<Row gutter={[0, 24]}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<BorrowForm />
				</Col>
			</Row>
		</LayoutPage>
	)
}
