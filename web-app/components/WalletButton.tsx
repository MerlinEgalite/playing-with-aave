import { useContext } from 'react'
import { useRouter } from 'next/router'

import Web3Modal from 'web3modal'
import AppContext from './app-context'

import { Web3Provider } from '@ethersproject/providers'


export default function WalletButton(): JSX.Element {
	const context = useContext(AppContext)
	const router = useRouter()
	const web3Modal: Web3Modal | undefined | null = context?.web3Modal

	const logoutOfWeb3Modal = function (): void {
		if (web3Modal) web3Modal.clearCachedProvider()
		window.location.reload()
	}

	const loadWeb3Modal = async function (): Promise<void> {
		const provider = await web3Modal?.connect()
		if (context?.setWeb3Provider) {
			context.setWeb3Provider(new Web3Provider(provider))
		}
	}

	const buttonOnClick = function (): void {
		if (!web3Modal?.cachedProvider) {
			loadWeb3Modal()
		} else {
			logoutOfWeb3Modal()
		}
	}

	return (
		<button onClick={buttonOnClick}>
			Click
		</button>
	)
}
