import { User } from '@sensenet/default-content-types'
import { Content } from '../Models/Content'

/**
 * Constant content definitions for sensenet
 */
export class ConstantContent {
  /**
   * Defines a visitor user content
   */
  public static VISITOR_USER: User = {
    Id: 6,
    DisplayName: 'Visitor',
    Domain: 'BuiltIn',
    Name: 'Visitor',
    Path: '/Root/IMS/BuiltIn/Portal/Visitor',
    LoginName: 'Visitor',
    Type: 'User',
  }

  /**
   * Defines a portal root content
   */
  public static PORTAL_ROOT: Content & { DisplayName: string } = {
    Id: 2,
    Path: '/Root',
    Name: 'Root',
    DisplayName: 'Root',
    Type: 'PortalRoot',
  }
}
