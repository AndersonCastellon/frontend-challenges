import Swiper from 'swiper'

export const planCosts: any = {
  arcade: {
    monthly: {
      cost: 9,
      freeMonths: 0
    },
    yearly: {
      cost: 90,
      freeMonths: 2
    }
  },
  advanced: {
    monthly: {
      cost: 12,
      freeMonths: 0
    },
    yearly: {
      cost: 120,
      freeMonths: 2
    }
  },
  pro: {
    monthly: {
      cost: 15,
      freeMonths: 0
    },
    yearly: {
      cost: 150,
      freeMonths: 2
    }
  }
}

export const addonsCosts: any = {
  'online-service': {
    monthly: 1,
    yearly: 10
  },
  'large-storage': {
    monthly: 2,
    yearly: 20
  },
  'customizable-profile': {
    monthly: 2,
    yearly: 20
  }
}

export function costToString (cost: number, yearly: boolean) {
  return `$${cost}/${yearly ? 'yr' : 'mo'}`
}

/**
 * The function "getPlanInfo" returns the cost data for a given plan ID, either yearly or monthly.
 * @param {string} planId - The `planId` parameter is a string that represents the unique identifier of
 * a plan. It is used to retrieve the cost information for a specific plan from the `planCosts` object.
 * @param {boolean} yearly - A boolean value indicating whether the plan information should be
 * retrieved for yearly or monthly costs.
 * @returns the data object, which contains the cost information for the specified plan.
 */
export function getPlanInfo (planId: string, yearly: boolean) {
  const plan = planCosts[planId]
  let data = {}

  if (plan) {
    if (yearly) {
      data = plan.yearly
    } else {
      data = plan.monthly
    }
  }

  return data
}

/**
 * The function sets the plan cost and free months information on an HTML element based on the provided
 * plan information and whether it is a yearly plan or not.
 * @param {any} planInfo - The `planInfo` parameter is an object that contains information about a
 * plan. It can have the following properties:
 * @param {HTMLElement} element - The `element` parameter is an HTML element that represents the
 * container or parent element where the plan information will be displayed. It is used to find
 * specific elements within this container using their IDs.
 * @param {boolean} yearly - The `yearly` parameter is a boolean value that indicates whether the plan
 * is billed yearly or monthly. If `yearly` is `true`, it means the plan is billed yearly. If `yearly`
 * is `false`, it means the plan is billed monthly.
 */
export function setPlanInfo (
  planInfo: any,
  element: HTMLElement,
  yearly: boolean
) {
  const costElement = element.querySelector('#plan-cost') as HTMLElement
  const freeElement = element.querySelector('#free-months') as HTMLElement

  const nativeInput = element.querySelector(
    'input[type=radio]'
  ) as HTMLInputElement

  if (costElement) {
    const cost: number = planInfo.cost || 0
    costElement.innerText = costToString(cost, yearly)

    if (nativeInput) {
      nativeInput.value = `${cost}`
    }
  }

  if (freeElement) {
    const freeMonths: number = planInfo.freeMonths || 0

    if (freeMonths > 0) {
      freeElement.removeAttribute('style')
      freeElement.innerText = `${freeMonths} months free`
    } else {
      freeElement.setAttribute('style', 'display: none;')
    }
  }
}

/**
 * The function `getAddonCost` returns the cost of an addon based on its ID and whether it is billed
 * yearly or monthly.
 * @param {string} addonId - The `addonId` parameter is a string that represents the unique identifier
 * of an addon.
 * @param {boolean} yearly - A boolean value indicating whether the cost should be calculated on a
 * yearly basis or not. If `yearly` is `true`, the function will return the yearly cost of the addon.
 * If `yearly` is `false` or not provided, the function will return the monthly cost of the addon
 * @returns the cost of the addon based on the addonId and whether it is yearly or monthly. If yearly
 * is true, it returns the yearly cost of the addon. Otherwise, it returns the monthly cost of the
 * addon.
 */
export function getAddonCost (addonId: string, yearly: boolean) {
  const addonInfo = addonsCosts[addonId]

  if (yearly) {
    return addonInfo.yearly
  }

  return addonInfo.monthly
}

/**
 * The function sets the cost of an addon and updates the corresponding HTML element.
 * @param {HTMLElement} element - The `element` parameter is an HTML element that represents the
 * container where the cost will be displayed.
 * @param {number} cost - The `cost` parameter is a number that represents the cost of an addon.
 * @param {boolean} yearly - The `yearly` parameter is a boolean value that indicates whether the cost
 * is for a yearly subscription or a monthly subscription. If `yearly` is `true`, it means the cost is
 * for a yearly subscription. If `yearly` is `false`, it means the cost is for a
 */
export function setAddonCost (
  element: HTMLElement,
  cost: number,
  yearly: boolean
) {
  if (element) {
    const costElement = element.querySelector('#cost') as HTMLElement

    const nativeInput = element.querySelector(
      'input[type=checkbox]'
    ) as HTMLInputElement

    if (costElement) {
      costElement.innerText = `+${costToString(cost, yearly)}`
    }

    if (nativeInput) {
      nativeInput.value = cost.toString()
    }
  }
}

/**
 * The function `calcSummaryTotal` calculates the total sum of values from an array of HTML input
 * elements.
 * @param {HTMLInputElement[]} inputs - An array of HTML input elements.
 * @returns the sum of the values of the HTML input elements passed in the `inputs` array.
 */
export function calcSummaryTotal (inputs: HTMLInputElement[]) {
  return inputs.map(input => +input.value).reduce((prev, acc) => prev + acc, 0)
}

export function getSummary () {
  try {
    const form = document.querySelector('.step-form form') as HTMLFormElement
    const switchBilling = form?.querySelector(
      '#switch-billing'
    ) as HTMLInputElement
    const summaryElement = document.querySelector('.summary') as HTMLElement
    const selectedPlanNameElement = summaryElement.querySelector(
      '.selected-plan__name'
    ) as HTMLElement
    const selectedPlanCostElement = summaryElement.querySelector(
      '.selected-plan__cost'
    ) as HTMLElement
    const selectedPlanInput = form?.querySelector(
      'input[type=radio][name=plan]:checked'
    ) as HTMLInputElement

    const summaryTableBody = summaryElement.querySelector('#summary-table-body')

    const addonInputs = form.querySelectorAll<HTMLInputElement>(
      '[data-custom-checkbox] input[type=checkbox]:checked'
    )

    const yearly = switchBilling.value === 'yearly'

    //Set selected plan name
    selectedPlanNameElement.innerText = `${selectedPlanInput.placeholder} (${
      yearly ? 'Yearly' : 'Monthly'
    })`
    selectedPlanCostElement.innerHTML = `
    <strong>
    ${costToString(+selectedPlanInput.value, yearly)}
    </strong>
    `

    //Set selected add-ons
    const oldRows =
      summaryElement.querySelectorAll<HTMLElement>('.summary__item-row')

    oldRows.forEach(row => {
      row.parentElement?.removeChild(row)
    })

    addonInputs.forEach(addonInput => {
      const template = summaryElement.querySelector(
        '#summary-row-template'
      ) as HTMLTemplateElement
      const row = template.content.cloneNode(true) as HTMLTableRowElement
      const item = row.querySelector('#summary-item') as HTMLElement
      const cost = row.querySelector('#summary-item-cost') as HTMLElement

      item.innerText = addonInput.placeholder
      cost.innerText = costToString(+addonInput.value, yearly)

      summaryTableBody?.appendChild(row)
    })

    // set summary total
    const total = calcSummaryTotal([...addonInputs, selectedPlanInput])

    const totalElement = summaryElement.querySelector(
      '.summary__total .cost--total'
    ) as HTMLElement
    totalElement.innerText = `+${costToString(total, yearly)}`
  } catch (error) {
    console.log(error)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const switchBilling = document.querySelector(
    '#switch-billing'
  ) as HTMLInputElement

  const radios = Array.from(
    document.querySelectorAll('.plan-radio-button')
  ) as HTMLElement[]

  const addons = Array.from(
    document.querySelectorAll('.checkbox[data-custom-checkbox]')
  ) as HTMLElement[]

  if (switchBilling) {
    switchBilling.addEventListener('change', () => {
      const yearly = switchBilling.checked

      switchBilling.value = yearly ? 'yearly' : 'monthly'

      radios.forEach(planRadio => {
        const planId = planRadio.dataset.plan
        if (planId) {
          const info = getPlanInfo(planId, yearly)
          setPlanInfo(info, planRadio, yearly)
        }
      })

      addons.forEach(addon => {
        const addonId = addon.dataset.checkboxId
        if (addonId) {
          const cost = getAddonCost(addonId, yearly)
          setAddonCost(addon, cost, yearly)
        }
      })
    })
  }

  const swiperElement = document.querySelector('.form__swiper') as any

  if (swiperElement) {
    const swiperInstance: Swiper = swiperElement.swiper

    if (swiperInstance) {
      swiperInstance.on('activeIndexChange', swiper => {
        console.log(swiper)

        if (swiper.activeIndex === 3) {
          getSummary()
        }
      })
    }
  }
})
