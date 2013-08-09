#!/usr/bin/ruby
#Usage: manhattan.rb <coordinate input file> <threshold> <use stdout>

#Example: manhattan.rb WI-WIOB.minus-KC-WI.minus.combined 4 true

infile = ARGV[0]
threshold = Float(ARGV[1])
use_stdout = false
if(ARGV.length == 3 && ARGV[2] == "true")
    use_stdout = true
end

inhandl = File.open(infile,"r")
if(!use_stdout)
    pos_outhandl = File.open("Manhattan_gt_#{threshold}","w")
    neg_outhandl = File.open("Manhattan_lt_#{threshold}","w")
end

while(line = inhandl.gets)
    x = Float(line.split(/ /)[0])
    y = Float(line.split(/ /)[1])
    if(x > 0 && y > 0 && x + y > threshold)
        if(!use_stdout)
            pos_outhandl.puts("#{x} #{y}")
        else
            puts("#{x} #{y}")
        end
    elsif(x < 0 && y < 0 && x + y < (-1 * threshold))
        if(!use_stdout)
            neg_outhandl.puts("#{x} #{y}")
        else
            puts("#{x} #{y}")
        end
    end
end

inhandl.close
if(!use_stdout)
    pos_outhandl.close
    neg_outhandl.close
end
