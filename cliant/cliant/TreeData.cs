﻿using System;
using System.Collections.Generic;
using System.Text;

namespace cliant
{
    class TreeData
    {
        float locationX { set; get; }
        float locationY { set; get; }
        int growStage { set; get; }
        int decoration { set; get; }
        int point { set; get; }
        int NumofHuman { set; get; }
        float time { set; get; }
        int decoMax { set; get; }
        TreeData(float locationX, float locationY, int growStage, int decoration, int point, int NumofHuman, float time, int decoMax)
        {
            this.locationX = locationX;
            this.locationY = locationY;
            this.growStage = growStage;
            this.decoration = decoration;
            this.point = point;
            this.NumofHuman = NumofHuman;
            this.time = time;
            this.decoMax = decoMax;
        }

        void ContentUpdate()
        {
            throw new NotImplementedException("ContentUpdateは未実装です");
        }
    }
}
