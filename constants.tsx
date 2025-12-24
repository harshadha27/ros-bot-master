
import { BOMItem, ROSCommand } from './types';

export const INITIAL_BOM: BOMItem[] = [
  {
    id: '1',
    name: 'Raspberry Pi 4 (4GB)',
    category: 'Electronics',
    role: 'Primary Onboard Computer',
    justification: 'Runs Ubuntu and ROS core natively; high GPIO count for sensors.',
    link: 'https://www.raspberrypi.com/products/raspberry-pi-4-model-b/',
    costEstimate: 55
  },
  {
    id: '2',
    name: 'N20 Micro Gear Motors (x2)',
    category: 'Mechanical',
    role: 'Differential Drive Locomotion',
    justification: 'High torque in a small form factor, essential for differential steering.',
    link: 'https://www.pololu.com/category/60/micro-gear-motors',
    costEstimate: 15
  },
  {
    id: '3',
    name: 'L298N Motor Driver',
    category: 'Electronics',
    role: 'Motor Control Interface',
    justification: 'Robust dual-channel H-bridge for controlling motor direction and speed.',
    link: 'https://www.sparkfun.com/products/14450',
    costEstimate: 8
  },
  {
    id: '4',
    name: 'RPLIDAR A1',
    category: 'Sensors',
    role: 'Unique Feature: 360° Mapping',
    justification: 'Enables SLAM (Simultaneous Localization and Mapping) for extra marks.',
    link: 'https://www.slamtec.com/en/Lidar/A1',
    costEstimate: 99
  }
];

export const COMMON_ROS_COMMANDS: ROSCommand[] = [
  {
    command: 'roslaunch robot_bringup robot.launch',
    description: 'Initializes all robot hardware nodes.',
    category: 'System'
  },
  {
    command: 'rosrun teleop_twist_keyboard teleop_twist_keyboard.py',
    description: 'Launch standard keyboard control node.',
    category: 'Control'
  },
  {
    command: 'rosrun rviz rviz',
    description: 'Open 3D visualization for sensor data.',
    category: 'Nav'
  },
  {
    command: 'rostopic echo /cmd_vel',
    description: 'Monitor velocity commands sent to motors.',
    category: 'Control'
  }
];
