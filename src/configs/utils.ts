import { NETWORK_TYPE, TOKEN } from "./interfaces";
import { tokensConfigs } from "./tokens";
import { networks } from "./networks";
import { ITokenInfo } from "./interfaces";

// TODO = add more types support
const exchangeToken = TOKEN.ERC20;

export const getTokenConfig = (addr: string): ITokenInfo => {
  let token: ITokenInfo;

  if ([TOKEN.ERC20, TOKEN.ERC721].includes(exchangeToken)) {
    token = tokensConfigs.find(
      t =>
        t.erc20Address.toUpperCase() === addr.toUpperCase() ||
        t.hrc20Address.toUpperCase() === addr.toUpperCase(),
    );
  }

  if ([TOKEN.ONE, TOKEN.ETH].includes(exchangeToken)) {
    token = tokensConfigs.find(
      t =>
        t.type === exchangeToken // &&
      // t.network === stores.exchange.network,
    );
  }

  if (!token) {
    return null;
  }

  const config = networks[token.network]?.layerzero;

  return { ...token, config };
};

export const findTokenConfig = (token: {
  erc20Address: string;
  hrc20Address: string;
  network: NETWORK_TYPE;
}) => {
  const { erc20Address, hrc20Address, network } = token;

  return tokensConfigs.find(
    t =>
      (t.erc20Address.toLowerCase() === erc20Address.toLowerCase() ||
        t.hrc20Address.toLowerCase() === hrc20Address.toLowerCase()) &&
      network === t.network,
  );
};

export const findTokenConfigByName = (symbol: string, network: string) => {
  return tokensConfigs.find(
    t => t.symbol.toLowerCase() === symbol.toLowerCase() &&
      network.toLowerCase() === t.network.toLowerCase()
  );
};
