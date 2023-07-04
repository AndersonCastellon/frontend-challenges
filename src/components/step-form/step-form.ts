const planCosts: any = {
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

/**
 * The function "getPlanInfo" returns the cost data for a given plan ID, either yearly or monthly.
 * @param {string} planId - The `planId` parameter is a string that represents the unique identifier of
 * a plan. It is used to retrieve the cost information for a specific plan from the `planCosts` object.
 * @param {boolean} yearly - A boolean value indicating whether the plan information should be
 * retrieved for yearly or monthly costs.
 * @returns the data object, which contains the cost information for the specified plan.
 */
function getPlanInfo (planId: string, yearly: boolean) {
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
function setPlanInfo (planInfo: any, element: HTMLElement, yearly: boolean) {
  const costElement = element.querySelector('#plan-cost') as HTMLElement
  const freeElement = element.querySelector('#free-months') as HTMLElement

  if (costElement) {
    const cost: number = planInfo.cost || 0
    costElement.innerText = `${cost}/${yearly ? 'yr' : 'mo'}`
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

document.addEventListener('DOMContentLoaded', () => {
  const switchBilling = document.querySelector(
    '#switch-billing'
  ) as HTMLInputElement

  const radios = Array.from(
    document.querySelectorAll('.plan-radio-button')
  ) as HTMLElement[]

  if (switchBilling) {
    switchBilling.addEventListener('change', () => {
      const yearly = switchBilling.checked

      radios.forEach(planRadio => {
        const planId = planRadio.dataset.plan
        if (planId) {
          const info = getPlanInfo(planId, yearly)
          setPlanInfo(info, planRadio, yearly)
        }
      })
    })
  }
})
