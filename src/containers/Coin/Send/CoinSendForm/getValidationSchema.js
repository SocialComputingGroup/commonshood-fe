import * as Yup from 'yup';

export default function getValidationSchema(t) {
    return Yup.object().shape({
        selectedBalance: Yup.number(),
        amount: Yup.string()
            .test('tooHigh',t("balanceTooHigh"), function(value){
                return Number.parseInt(value) <= Number.parseInt(this.parent.selectedBalance)})
            .when('decimals', {
                is: 2,
                then: Yup.string().matches(/^([1-9][0-9]*)$|^([0-9]+([.][0-9][0-9]?))$/, t('checkForCoin')),
            })
            .when('decimals', {
                is: 0, //coupon
                then: Yup.string().matches(/^[1-9][0-9]*$/, t('checkForCoupon')),
            }),
        decimals: Yup.number()
    });
}