import type { FitnessSciencePost } from '../blogPosts';
import squatRackImage from '../../assets/images/protocol_weekly_sets_1794839054507.jpg';

export default {
  id: 'squat-depth-and-training-results',
  title: 'Does Squat Depth Change Your Training Results?',
  excerpt: 'Squat depth can affect muscle growth and strength. Choose a repeatable range of motion so your training log captures meaningful progress.',
  publishedOn: '2026-11-23',
  category: 'BIOMECHANICS',
  readTime: '3 MIN READ',
  image: squatRackImage,
  sections: [
    {
      heading: 'Define the rep before adding weight',
      paragraphs: [
        'A squat entry in your log needs more context than weight and reps. If you add weight while stopping higher on each repetition, you have changed the movement you are comparing. Recording a consistent depth makes it easier to judge whether you can lift more or complete more reps through the same range of motion.',
        'Range of motion describes how far your joints move during an exercise. In a squat, going deeper increases hip and knee bending. Researchers have tested whether practicing different depths changes which muscles grow and how much strength carries over to a squat at another depth.',
      ],
    },
    {
      heading: 'The muscle response depends on the comparison',
      paragraphs: [
        'Kubo and colleagues assigned 17 men to full or half squat training for ten weeks, with two sessions each week. MRI measurements showed larger increases in the gluteus maximus and thigh adductor muscles with full squats. The knee extensors grew by a similar amount in both groups. Practicing full squats also produced a larger improvement in the full squat strength test.',
        'Bloomquist and colleagues studied 17 men for twelve weeks using deep or shallow squats. The deep squat group gained more muscle size at the front of the thigh. Strength improvements also reflected the practiced movement. The shallow squat group improved much more on its shallow squat test than on its deep squat test.',
      ],
    },
    {
      heading: 'Apply the findings to your own movement',
      paragraphs: [
        'Both squat studies were small and included men. Their results describe particular depth comparisons over a few months. A 2023 review by Kassiano and colleagues, covering eleven studies, also found that the part of the movement trained matters. Working with a muscle in a longer position, through a full movement or selected partial movement, often produced favorable growth in the muscles studied.',
        'For general training, choose a squat variation and a depth you can repeat with control. If you want to explore a deeper range, use your warm-up to find a manageable load and practice that range consistently. The studies provide no single depth or joint angle that fits every person and exercise.',
      ],
    },
    {
      heading: 'Make the next session easy to compare',
      paragraphs: [
        'Keep the squat variation, stance, and intended depth consistent across comparable sessions. A short video from the same side view can help you notice whether the bottom position changes as you get tired. Add a brief depth note alongside your sets, weight, reps, and effort.',
        'When you deliberately change depth, note that change and establish a fresh baseline at the new range. Build reps or load while keeping that range repeatable. If you open the Lower Body routine from this article, adjust its squat load to suit the movement you are practicing before starting your working sets.',
      ],
    },
  ],
  references: [
    {
      label: 'Kubo, Ikebukuro & Yata (2019). Effects of squat training with different depths on lower limb muscle volumes. European Journal of Applied Physiology.',
      url: 'https://link.springer.com/article/10.1007/s00421-019-04181-y',
    },
    {
      label: 'Bloomquist et al. (2013). Effect of range of motion in heavy load squatting on muscle and tendon adaptations. European Journal of Applied Physiology.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23604798/',
    },
    {
      label: 'Kassiano et al. (2023). Which ROMs Lead to Rome? A Systematic Review of the Effects of Range of Motion on Muscle Hypertrophy. Journal of Strength and Conditioning Research.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/36662126/',
    },
  ],
  protocolSpec: {
    code: 'SQUAT-ROM',
    objective: 'Keep squat depth repeatable so changes in weight and reps can be compared across sessions.',
    metrics: [
      { label: 'Variation', value: 'Keep consistent' },
      { label: 'Depth', value: 'Repeat with control' },
      { label: 'Log', value: 'Weight, reps, effort' },
      { label: 'Compare', value: 'Same range of motion' },
    ],
    steps: [
      {
        id: 'squat-depth-warm-up',
        title: 'Choose a repeatable depth',
        instruction: 'Use warm-up reps to choose a depth and load you can control. Adjust the routine template to suit that movement.',
      },
      {
        id: 'squat-depth-check',
        title: 'Check your bottom position',
        instruction: 'Watch whether depth changes across reps. A video from a consistent side view can help you compare sessions.',
      },
      {
        id: 'squat-depth-log',
        title: 'Record the movement you performed',
        instruction: 'Log weight, reps, and effort. Add a brief note describing your intended depth.',
      },
      {
        id: 'squat-depth-progress',
        title: 'Progress within the same range',
        instruction: 'Compare reps and load at the same depth. Record a new baseline when you deliberately change the range of motion.',
      },
    ],
    trackerPreset: {
      id: 'squat-depth-and-training-results',
      label: 'Open Lower Body Routine',
      routineDefId: 'lower-split',
      level: 'Beginner',
      note: 'Squat depth practice: Adjust the template weights to your current ability. Choose a repeatable depth, log effort, and note any deliberate change in range of motion.',
    },
  },
} satisfies FitnessSciencePost;
