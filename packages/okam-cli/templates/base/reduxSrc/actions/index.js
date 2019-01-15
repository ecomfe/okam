/**
 * @file redux actions
 * @author ${author|raw}
 */

import * as counterActions from './counter';
export default Object.assign({}, counterActions);
// export default counterActions; // 这种写法 支付宝小程序编译会出错
