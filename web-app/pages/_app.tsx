import App from 'next/app'
import AppContext, { IAppContext } from '../utils/app-context'
import Web3Modal from 'web3modal'
import { Web3Provider } from '@ethersproject/providers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { GlobalStyle } from '../styles/style'
import '../styles/App.css'


type AppState = {
	initialized: boolean
	web3Modal: Web3Modal | null
	web3Provider: Web3Provider | null
	selectedMenuKey: string
	address: string
	isWhitelistedWallet: boolean
}

export default class MainApp extends App {
	state: AppState = {
		initialized: false,
		web3Modal: null,
		web3Provider: null,
		selectedMenuKey: 'home',
		address: '',
		isWhitelistedWallet: false,
	}

	componentDidMount(): void {
		const providerOptions = {
			walletconnect: {
				package: WalletConnectProvider,
				options: {
					infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
				},
			},
		}

		let web3Modal: Web3Modal
		if (process.browser) {
			// TODO: hmmm I think this is deprecated
			web3Modal = new Web3Modal({
				network: 'mainnet', // optional
				cacheProvider: true, // optional
				providerOptions, // required
			})
			this.setWeb3Modal(web3Modal)

			if (web3Modal.cachedProvider) {
				this.loadWeb3Modal(web3Modal)
			}
		}
	}

	async loadWeb3Modal(web3Modal: Web3Modal): Promise<void> {
		const provider = await web3Modal.connect()
		const web3Provider = new Web3Provider(provider)

		provider.on('accountsChanged', (accounts: string[]) => {
			this.setAddress(accounts[0])
		})

		const address = await web3Provider.getSigner().getAddress()
		this.setAddress(address)

		this.setWeb3Provider(web3Provider)
	}

	setWeb3Modal(web3Modal: Web3Modal): void {
		this.setState({ web3Modal }, () => this.setState({ initialized: true }))
	}

	setWeb3Provider(web3Provider: Web3Provider): void {
		this.setState({ web3Provider })
	}

	setAddress(address: string): void {
		this.setState({ address })
	}

	setIsWhitelistedWallet(isWhitelistedWallet: boolean): void {
		this.setState({ isWhitelistedWallet })
	}

	render(): JSX.Element {
		const { Component, pageProps } = this.props

		const injectedGlobalContext: IAppContext = {
			initialized: this.state.initialized,
			web3Modal: this.state.web3Modal,
			web3Provider: this.state.web3Provider,
			address: this.state.address,
			setWeb3Modal: (web3Modal) => this.setWeb3Modal(web3Modal),
			setWeb3Provider: (web3Provider) => this.setWeb3Provider(web3Provider),
			setAddress: (address) => this.setAddress(address),
		}

		return (
			<AppContext.Provider value={injectedGlobalContext}>
				<GlobalStyle />
				<Component {...pageProps} />
			</AppContext.Provider>
		)
	}
}
