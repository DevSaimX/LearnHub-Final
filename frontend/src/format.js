const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export const priceLabel = price => price === 0 ? 'Free' : currency.format(price)
