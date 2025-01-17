import Unitz from 'unitz'

export default {
    /**
     * Pretty print ingredient amount with units.
     * Handles min and max amounts.
     * Handles oz presentation as fractions.
     * Handles servings.
     * Converts between: oz, cl, ml.
     *
     * @param {object} ingredient
     * @param {string} convertTo
     * @param {number} servings
     * @returns {string}
     */
    print(ingredient, convertTo = 'ml', servings = 1) {
        if (!convertTo) {
            convertTo = 'ml'
        }

        let orgAmount = ingredient.amount
        if (String(orgAmount).includes('/')) {
            orgAmount = Unitz.parse(`${orgAmount} fl-oz`).value
        }

        let orgAmountMax = (ingredient.amount_max || 0)
        if (String(orgAmountMax).includes('/')) {
            orgAmountMax = Unitz.parse(`${orgAmountMax} fl-oz`).value
        }

        orgAmount *= servings
        orgAmountMax *= servings

        let orgUnits = ingredient.units ? ingredient.units.toLowerCase() : ''

        // Don't convert unconvertable units
        if (orgUnits != 'ml' && orgUnits != 'oz' && orgUnits != 'cl') {
            return `${orgAmount == 0 ? '' : orgAmount}${orgAmountMax != 0 ? '-' + orgAmountMax : ''} ${orgUnits}`
        }

        let minAmount = this.convertFromTo(orgUnits, orgAmount, convertTo)
        let maxAmount = this.convertFromTo(orgUnits, orgAmountMax, convertTo)

        if (convertTo == 'oz') {
            minAmount = this.asFraction(minAmount)
            maxAmount = this.asFraction(maxAmount)
        }

        return `${minAmount == 0 ? '' : minAmount}${maxAmount != 0 ? '-' + maxAmount : ''} ${convertTo}`
    },

    /**
     * @param {number} number
     * @returns {string}
     */
    asFraction(number) {
        return new Unitz.Fraction(number, [2, 3, 4]).string
    },

    /**
     * @param {string} fromUnits
     * @param {number} amount
     * @param {string} toUnits
     * @returns {number}
     */
    convertFromTo(fromUnits, amount, toUnits) {
        if (fromUnits == 'ml') {
            if (toUnits == 'oz') {
                return this.ml2oz(amount)
            }
            if (toUnits == 'cl') {
                return this.ml2cl(amount)
            }
        }

        if (fromUnits == 'oz') {
            if (toUnits == 'ml') {
                return this.oz2ml(amount)
            }
            if (toUnits == 'cl') {
                return this.oz2cl(amount)
            }
        }

        if (fromUnits == 'cl') {
            if (toUnits == 'ml') {
                return this.cl2ml(amount)
            }
            if (toUnits == 'cl') {
                return this.cl2oz(amount)
            }
        }

        return amount
    },

    /**
     * @param {number} amount
     * @returns {number}
     */
    cl2ml(amount) {
        return amount * 10
    },

    /**
     * @param {number} amount
     * @returns {number}
     */
    cl2oz(amount) {
        return this.ml2oz(amount * 10)
    },

    /**
     * @param {number} amount
     * @returns {number}
     */
    oz2ml(amount) {
        return Unitz.parse(`${amount} fl-oz`).value * 30
    },

    /**
     * @param {number} amount
     * @returns {number}
     */
    oz2cl(amount) {
        return this.oz2ml(amount) / 10
    },

    /**
     * @param {number} amount
     * @returns {number}
     */
    ml2oz(amount) {
        return amount / 30
    },

    /**
     * @param {number} amount
     * @returns {number}
     */
    ml2cl(amount) {
        return amount / 10
    },
}
