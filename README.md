ArrVis
======

ArrVis is a DNA microarray visualization tool originally developed to display MA data from Roche NimbleGen© (http://www.nimblegen.com/) assays but should also be able to display RNASeq data soon.

Dev. Instructions
-----------------

1. navigate to ArrVis/ directory
2. run foreman server
    $ foreman start
3. use http://scriptular.com/ regex editor
4. use node interactive js shell

Use Cases
---------

1. user has two MA data files to compare and doesn't want to highlight any particular sequence(s) 
2. user has two MA data files to compare and wants to highlight sequences by manhattan, euclidean, larger abs min, or other distance measure
3. user has two MA data files and one additional MA data file with preselected sequences to highlight and overlay
4. user has three MA data files and doesn't want to highlight any particular sequence(s)
