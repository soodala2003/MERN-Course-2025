import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';
import StatItem from './StatItem';

//we are grabbing the defaultStats prop
const StatsContainer = ({ defaultStats }) => {
  //the only dynamic value is actually going to be the pending one,
  //the interview or decline
  //defaultStats?.pending: the optional chaining just in case there's no value
  const stats = [
    {
      title: 'pending applications',
      count: defaultStats?.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: '#f59e0b',
      bcg: '#fef3c7',
    },
    {
      title: 'interviews scheduled',
      count: defaultStats?.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bcg: '#e0e8f9',
    },
    {
      title: 'jobs declined',
      count: defaultStats?.declined || 0,
      icon: <FaBug />,
      color: '#d66a6a',
      bcg: '#ffeeee',
    },
  ];
  return (
    <Wrapper>
      {stats.map((item) => {
        return <StatItem key={item.title} {...item} />;
      })}
    </Wrapper>
  );
};
export default StatsContainer;
