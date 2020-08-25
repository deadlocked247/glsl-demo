import create from 'zustand';
import pingSound from './ping.mp3';
import clamp from 'lodash-es/clamp';

const ping = new Audio(pingSound);
const [useStore] = create((set) => ({
  count: 0,
  welcome: true,
  api: {
    pong(velocity) {
      ping.currentTime = 0;
      ping.volume = clamp(velocity / 20, 0, 1);
      ping.play();
      if (velocity > 4) set((state) => ({ count: state.count + 1 }));
    },
    reset: (welcome) => set((state) => {
        localStorage.setItem('highscore', state.count)
        return ({ welcome, count: welcome ? state.count : 0 });
    })
  },
}));

export default useStore;