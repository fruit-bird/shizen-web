// src/lib/stores/audioStore.ts
import { writable } from 'svelte/store';
import PocketBase from 'pocketbase';
import type { RecordModel } from 'pocketbase';

// Assuming you have a PocketBase instance set up
const pb = new PocketBase("http://127.0.0.1:8090");

type AudioState = {
  currentSongId: string | null;
  isPlaying: boolean;
  songData: {
    title: string;
    artists: RecordModel[];
    coverArt: string;
    audioUrl: string;
  } | null;
};

const createAudioStore = () => {
  const { subscribe, set, update } = writable<AudioState>({
    currentSongId: null,
    isPlaying: false,
    songData: null,
  });

  return {
    subscribe,
    playSong: async (songId: string) => {
      try {
        const song = await pb.collection('songs').getOne(songId);
        update(state => ({
          currentSongId: songId,
          isPlaying: true,
          songData: {
            title: song.title,
            artists: song.artists, // Adjust field names as per your schema
            coverArt: pb.getFileUrl(song, song.coverArt),
            audioUrl: pb.getFileUrl(song, song.audioFile),
          }
        }));
      } catch (error) {
        console.error('Failed to load song:', error);
        // Handle error (e.g., show a notification to the user)
      }
    },
    pauseSong: () => update(state => ({ ...state, isPlaying: false })),
    resumeSong: () => update(state => ({ ...state, isPlaying: true })),
    stopSong: () => set({ currentSongId: null, isPlaying: false, songData: null }),
  };
};

export const audioStore = createAudioStore();