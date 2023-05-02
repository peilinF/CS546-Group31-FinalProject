import Header from './Header';
import styles from '@/styles/layout.module.css';

const Layout = (props) => (
  <div className={styles.layoutStyle}>
    <Header />
    {props.children}
  </div>
);

export default Layout;
