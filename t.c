#include "sf2.h"
// script generated switch statement..
void merge_zones(short *dest, short *from)
{
  for (int op = 0; op < 60; op++)
  {
    switch (op)
    {
    case StartAddrOfs:
      unsigned short *val = &((unsigned short *)dest)[op];
      *val += ((unsigned short *)from)[op];
      break;
    case EndAddrOfs:
      unsigned short *val = &((unsigned short *)dest)[op];
      *val += ((unsigned short *)from)[op];
      break;
    case StartLoopAddrOfs:
      unsigned short *val = &((unsigned short *)dest)[op];
      *val += ((unsigned short *)from)[op];
      break;
    case EndLoopAddrOfs:
      unsigned short *val = &((unsigned short *)dest)[op];
      *val += ((unsigned short *)from)[op];
      break;
    case ModLFO2Pitch:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case VibLFO2Pitch:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case ModEnv2Pitch:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case FilterFc:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case FilterQ:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case ModLFO2FilterFc:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case ModEnv2FilterFc:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case ModLFO2Vol:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case Pan:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case ModLFODelay:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case ModLFOFreq:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case VibLFODelay:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case VibLFOFreq:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case ModEnvDelay:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case ModEnvAttack:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case ModEnvHold:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case ModEnvDecay:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case ModEnvSustain:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case ModEnvRelease:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case Key2ModEnvHold:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case Key2ModEnvDecay:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case VolEnvDelay:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case VolEnvAttack:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case VolEnvHold:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case VolEnvDecay:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case VolEnvSustain:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case VolEnvRelease:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case Key2VolEnvHold:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case Key2VolEnvDecay:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case Attenuation:
      float *val = &((float *)dest)[op];
      *val += ((float *)from)[op];
      break;
    case CoarseTune:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case FineTune:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    case ScaleTune:
      int *val = &((int *)dest)[op];
      *val += ((int *)from)[op];
      break;
    }
  }
}
