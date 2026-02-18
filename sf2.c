#include <math.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

#include "sf2.h"

/* Safe clamp macro with proper parentheses to avoid operator precedence issues */
#define clamp(val, min, max) ((val) > (max) ? (max) : ((val) < (min) ? (min) : (val)))

static inline float fclamp(float val, float min, float max)
{
  return val > max ? max : val < min ? min : val;
}
static inline short add_pbag_val_to_zone(int genop, short ival, short pval)
{
  int irange[2], prange[2];
  switch (genop)
  {
  case StartAddrOfs:
  case EndAddrOfs:
  case StartLoopAddrOfs:
  case EndLoopAddrOfs:
  case StartAddrCoarseOfs:
  case EndAddrCoarseOfs:
  case StartLoopAddrCoarseOfs:
  case EndLoopAddrCoarseOfs:
    return ival;
  case ModLFODelay:
  case VibLFODelay:
  case ModEnvDelay:
  case VolEnvDelay:
  case VolEnvHold:
  case ModEnvHold:
    return clamp(ival, SF2_MIN_DELAY, SF2_MAX_DELAY_SHORT);
  case ModEnvAttack:
  case ModEnvDecay:
  case ModEnvRelease:
  case VolEnvAttack:
  case VolEnvDecay:
  case VolEnvRelease:
    return clamp(ival, SF2_MIN_DELAY, SF2_MAX_DELAY_LONG);
  case Key2ModEnvHold:
  case Key2ModEnvDecay:
  case Key2VolEnvHold:
  case Key2VolEnvDecay:
    return (short)clamp(ival + pval, SF2_MIN_KEY_MOD, SF2_MAX_KEY_MOD);
  case Pan:
    return (short)fclamp((float)ival + (float)pval * 0.001f, SF2_MIN_PAN, SF2_MAX_PAN);
  case Attenuation:
    return (short)fclamp((float)ival + (float)pval, SF2_MIN_ATTENUATION, SF2_MAX_ATTENUATION);
  case ModEnvSustain:
    return (short)clamp(ival + pval, SF2_MIN_SUSTAIN, SF2_MAX_SUSTAIN_MOD);
  case VolEnvSustain:
    return (short)fclamp((float)ival + (float)pval, SF2_MIN_SUSTAIN, SF2_MAX_SUSTAIN_VOL);
  case ModLFO2Pitch:
  case VibLFO2Pitch:
  case ModLFO2FilterFc:
  case ModEnv2FilterFc:
  case ModLFO2Vol:
  case ModEnv2Pitch:
    return (short)clamp(ival + pval, SF2_MIN_MODULATION, SF2_MAX_MODULATION);
  case FilterFc:
    return (short)clamp(ival + pval, SF2_MIN_FILTER_FC, SF2_MAX_FILTER_FC);
  case FilterQ:
    return (short)clamp(ival + pval, SF2_MIN_FILTER_Q, SF2_MAX_FILTER_Q);
  case VibLFOFreq:
  case ModLFOFreq:
    return (short)clamp(ival + pval, SF2_MIN_LFO_FREQ, SF2_MAX_LFO_FREQ);
  case Instrument:
    return pval;
  case KeyRange:
  case VelRange:
    irange[0] = ival & 0x007f;
    irange[1] = ival >> 8;
    prange[0] = pval & 0x007f;
    prange[1] = pval >> 8;
    if (irange[1] > prange[1])
      irange[1] = prange[1];
    if (irange[0] < prange[0])
      irange[0] = prange[0];
    ival = (short)(irange[0] + (irange[1] << 8));
    return ival;
  case CoarseTune:
    return 0;
  case SampleModes:
    return ival;
  default:
    return ival;
  }
}

#ifndef skipthis
extern void emitHeader(int pid, int bid, void *p);
extern void emitZone(int pid, void *ref);
extern void emitSample(int id, int pid, void *p);
extern void emitFilter(int type, uint8_t lo, uint8_t hi);
#endif

phdr *findPreset(int pid, int bank_id);
zone_t *findPresetZones(phdr *phr, int n);
int findPresetZonesCount(phdr *phr);

int nphdrs, npbags, npgens, npmods, nshdrs, ninsts, nimods, nigens, nibags;

phdr *phdrs;
pbag *pbags;
pmod *pmods;
pgen *pgens;
inst *insts;
ibag *ibags;
imod *imods;
igen *igens;
shdr *shdrs;
short *data;
char *info;
int nsamples;
float *sdta;
int sdtastart;
phdr *presetHeaders[128];
phdr *phdrRoot = 0;
phdr drumHeaders[128];
zone_t *presetZones;
zone_t *root;
zone_t *presets[0xff];

void *readpdta(void *pdtabuffer) {
  if (pdtabuffer == NULL) {
    return NULL;
  }
  
#define srr(section)                                           \
  sh = (section_header *)pdtabuffer;                           \
  pdtabuffer = (char *)pdtabuffer + SF2_SECTION_HEADER_SIZE;   \
  n##section##s = sh->size / sizeof(section);                  \
  section##s = (section *)pdtabuffer;                          \
  pdtabuffer = (char *)pdtabuffer + sh->size;
  
  section_header *sh;
  srr(phdr);
  srr(pbag);
  srr(pmod);
  srr(pgen);
  srr(inst);
  srr(ibag);
  srr(imod);
  srr(igen);
  srr(shdr);
  
  /* Allocate minimal placeholder - caller manages memory */
  void *result = malloc(4);
  return result; /* May return NULL if malloc fails */
}
void *loadpdta(void *pdtabuffer) {
  if (pdtabuffer == NULL) {
    return NULL;
  }
  
  void *result = readpdta(pdtabuffer);
  if (result == NULL) {
    return NULL;
  }
  
  for (uint16_t i = 0; i < SF2_MAX_PRESETS; i++) {
    phdr *phr = findPreset(i, 0x00);

    if (phr != NULL) {
      int n = findPresetZonesCount(phr);
      zone_t *zones = findPresetZones(phr, n);
      if (zones != NULL && i < SF2_MAX_BANKS) {
        presets[i] = zones;
      }
      emitHeader(phr->pid, phr->bankId, phr->name);
    }
    
    phr = findPreset(i, SF2_MAX_PRESETS);

    if (phr != NULL) {
      int n = findPresetZonesCount(phr);
      zone_t *zones = findPresetZones(phr, n);
      if (zones != NULL && (i + SF2_MAX_PRESETS) < SF2_MAX_BANKS) {
        presets[i + SF2_MAX_PRESETS] = zones;
      }
      emitHeader(phr->pid, phr->bankId, phr->name);
    }
  }
  
  /* Allocate minimal placeholder - caller manages memory */
  void *final_result = malloc(4);
  return final_result; /* May return NULL if malloc fails */
}

phdr *findPreset(int pid, int bank_id) {
  for (int i = 0; i < nphdrs; i++) {
    if (phdrs[i].pid == pid && phdrs[i].bankId == bank_id) {
      return &phdrs[i];
    }
  }
  return NULL;
}

#define filter_zone(g, ig)                    \
  if (g->val.ranges.lo > ig->val.ranges.hi || \
      g->val.ranges.hi < ig->val.ranges.lo || \
      ig->val.ranges.lo == ig->val.ranges.hi) \
    continue;

int findPresetZonesCount(phdr *phr) {
  if (phr == NULL) {
    return 0;
  }
  
  int nregions = 0;
  int pbagStart = phr->pbagNdx;
  int pbagEnd = (phr + 1)->pbagNdx;
  
  /* Validate pbag indices */
  if (pbagStart < 0 || pbagEnd > npbags || pbagStart >= pbagEnd) {
    return 0;
  }
  
  for (int j = pbagStart; j < pbagEnd; j++) {
    if (j >= npbags) break;
    
    pbag *pg = pbags + j;
    int pgenId = pg->pgen_id;
    int lastPgenId = (j < npbags - 1) ? pbags[j + 1].pgen_id : npgens - 1;
    
    /* Validate pgen indices */
    if (pgenId < 0 || lastPgenId > npgens || pgenId > lastPgenId) {
      continue;
    }
    
    unsigned char plokey = 0, phikey = 127, plovel = 0, phivel = 127;
    int instID = -1;
    
    for (int k = pgenId; k < lastPgenId; k++) {
      if (k >= npgens) break;
      
      pgen *g = pgens + k;
      
      if (g->genid == VelRange) {
        plovel = g->val.ranges.lo;
        phivel = g->val.ranges.hi;
        continue;
      }
      if (g->genid == KeyRange) {
        plokey = g->val.ranges.lo;
        phikey = g->val.ranges.hi;
        continue;
      }
      if (plokey == phikey) continue;
      
      if (g->genid == Instrument) {
        instID = g->val.uAmount;
        
        /* Validate instrument index */
        if (instID < 0 || instID >= ninsts) {
          continue;
        }
        
        inst *ihead = insts + instID;
        int ibgId = ihead->ibagNdx;
        int lastibg = (ihead + 1)->ibagNdx;
        
        /* Validate ibag indices */
        if (ibgId < 0 || lastibg > nibags || ibgId >= lastibg) {
          continue;
        }
        
        for (int ibg = ibgId; ibg < lastibg; ibg++) {
          if (ibg >= nibags) break;
          
          ibag *ibgg = ibags + ibg;
          int igenStart = ibgg->igen_id;
          int igenEnd = (ibg < nibags - 1) ? (ibgg + 1)->igen_id : nigens - 1;
          
          /* Validate igen indices */
          if (igenStart < 0 || igenEnd > nigens || igenStart > igenEnd) {
            continue;
          }
          
          pgen_t *lastig = igens + igenEnd;
          unsigned char ilokey = 0, ihikey = 127, ilovel = 0, ihivel = 127;

          for (pgen_t *ig = igens + igenStart; ig->genid != SampleId && ig < lastig; ig++) {
            if (ig->genid == KeyRange) {
              ilokey = ig->val.ranges.lo;
              ihikey = ig->val.ranges.hi;
              continue;
            }
            if (ig->genid == VelRange) {
              ilovel = ig->val.ranges.lo;
              ihivel = ig->val.ranges.hi;
              continue;
            }
            if (ig->val.ranges.lo == ig->val.ranges.hi) {
              break;
            }
            if (ig->genid == SampleId) {
              if (ig->val.uAmount < (unsigned short)nshdrs) {
                nregions++;
              }
              break;
            }
          }
        }
      }
    }
  }
  return nregions;
}

zone_t *findPresetZones(phdr *phr, int nregions) {
  if (phr == NULL || nregions < 0) {
    return NULL;
  }
  
  /* Allocate zones array with bounds check */
  if (nregions > 10000) { /* Sanity check to prevent excessive allocation */
    return NULL;
  }
  
  zone_t *zones = (zone_t *)malloc((nregions + 1) * sizeof(zone_t));
  if (zones == NULL) {
    return NULL;
  }
  
  /* Initialize generator attributes with defaults */
  short presetDefault[SF2_GENERATOR_COUNT] = {0};
  short pbagLegion[SF2_GENERATOR_COUNT] = {0};
  presetDefault[VelRange] = 127 << 8;
  presetDefault[KeyRange] = 127 << 8;

  int found = 0;
  int pbagStart = phr->pbagNdx;
  int pbagEnd = (phr + 1)->pbagNdx;
  
  /* Validate pbag indices */
  if (pbagStart < 0 || pbagEnd > npbags || pbagStart >= pbagEnd) {
    zones[0].SampleId = -1;
    return zones;
  }
  
  for (int j = pbagStart; j < pbagEnd && found < nregions; j++) {
    if (j >= npbags) break;
    
    pbag *pg = pbags + j;
    int pgenId = pg->pgen_id;
    int lastPgenId = (j < npbags - 1) ? pbags[j + 1].pgen_id : npgens - 1;
    
    /* Validate pgen indices */
    if (pgenId < 0 || lastPgenId > npgens || pgenId > lastPgenId) {
      continue;
    }
    
    memcpy(pbagLegion, presetDefault, SF2_GENERATOR_SIZE_BYTES);
    pbagLegion[Instrument] = -1;
    pbagLegion[PBagId] = j;
    
    for (int k = pgenId; k < lastPgenId; k++) {
      if (k >= npgens) break;
      
      pgen *g = pgens + k;
      if (g->genid < SF2_GENERATOR_COUNT) {
        pbagLegion[g->genid] = g->val.shAmount;
      }
      
      if (g->genid == Instrument) {
        int instId = pbagLegion[Instrument];
        
        /* Validate instrument index */
        if (instId < 0 || instId >= ninsts) {
          continue;
        }
        
        inst *instptr = insts + instId;
        int ibgId = instptr->ibagNdx;
        int lastibg = (instptr + 1)->ibagNdx;
        
        /* Validate ibag indices */
        if (ibgId < 0 || lastibg > nibags || ibgId >= lastibg) {
          continue;
        }
        
        short instDefault[SF2_GENERATOR_COUNT] = defattrs;
        short instZone[SF2_GENERATOR_COUNT] = {0};
        
        for (int ibg = ibgId; ibg < lastibg && found < nregions; ibg++) {
          if (ibg >= nibags) break;
          
          memcpy(instZone, instDefault, SF2_GENERATOR_SIZE_BYTES);
          ibag *ibgg = ibags + ibg;
          
          int igenStart = ibgg->igen_id;
          int igenEnd = (ibg < nibags - 1) ? (ibgg + 1)->igen_id : nigens;
          
          /* Validate igen indices */
          if (igenStart < 0 || igenEnd > nigens || igenStart >= igenEnd) {
            continue;
          }
          
          pgen_t *lastig = igens + igenEnd;
          
          for (pgen_t *ig = igens + igenStart; ig < lastig; ig++) {
            if (ig->genid < SF2_GENERATOR_COUNT) {
              instZone[ig->genid] = ig->val.shAmount;
            }
          }
          
          if (instZone[SampleId] == -1) {
            memcpy(instDefault, instZone, SF2_GENERATOR_SIZE_BYTES);
          } else {
            for (int i = 0; i < SF2_GENERATOR_COUNT; i++) {
              instZone[i] = add_pbag_val_to_zone(i, instZone[i], pbagLegion[i]);
            }
            instZone[IBAGID] = ibg;
            instZone[PBagId] = j;
            memcpy(zones + found, instZone, SF2_GENERATOR_SIZE_BYTES);
            emitZone(phr->pid, zones + found);
            found++;
          }
        }
      }
    }
    if (pbagLegion[Instrument] == -1) {
      memcpy(presetDefault, pbagLegion, SF2_GENERATOR_SIZE_BYTES);
    }
  }
  
  /* Mark end of zones */
  if (found < nregions + 1) {
    zone_t *dummy = zones + found;
    dummy->SampleId = -1;
  }
  
  return zones;
}

zone_t *filterForZone(zone_t *from, uint8_t key, uint8_t vel) {
  if (from == NULL) {
    return NULL;
  }
  
  for (zone_t *z = from; z != NULL; z++) {
    if (z->SampleId == -1) {
      break;
    }
    if (vel > 0 && (z->VelRange.lo > vel || z->VelRange.hi < vel)) {
      continue;
    }
    if (key > 0 && (z->KeyRange.lo > key || z->KeyRange.hi < key)) {
      continue;
    }
    return z;
  }
  
  /* Retry with relaxed filters */
  if (vel > 0) {
    return filterForZone(from, key, 0);
  }
  if (key > 0) {
    return filterForZone(from, 0, vel);
  }
  
  /* Return first zone as fallback if presetZones exists */
  return (presetZones != NULL) ? &presetZones[0] : NULL;
}

void *shdrref() { 
  return shdrs; 
}

void *presetRef() { 
  return presets; 
}

void *instRef(int instId) { 
  if (instId < 0 || instId >= ninsts) {
    return NULL;
  }
  return insts + instId; 
}
